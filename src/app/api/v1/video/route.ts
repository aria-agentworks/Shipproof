import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, incrementVideoCount, fireWebhook } from '@/lib/api-auth'
import { hashVideoData, generateVerificationCode } from '@/lib/video-hasher'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const {
      order_id,
      buyer_email,
      video_data,
      video_url,
      metadata,
    } = body

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    }
    if (!buyer_email && !video_data && !video_url) {
      return NextResponse.json(
        { error: 'Provide buyer_email, video_data (base64), or video_url' },
        { status: 400 }
      )
    }

    let code = generateVerificationCode(8)
    let exists = await db.video.findUnique({ where: { uniqueCode: code } })
    let attempts = 0
    while (exists && attempts < 20) {
      code = generateVerificationCode(8)
      exists = await db.video.findUnique({ where: { uniqueCode: code } })
      attempts++
    }

    const videoHash = video_data ? hashVideoData(video_data) : null
    const storageProvider = video_data ? 'base64' : video_url ? 'url' : 'none'
    const storageKey = video_url || null
    const duration = metadata?.duration || null
    const fileSize = metadata?.file_size || null

    const video = await db.video.create({
      data: {
        orderId: String(order_id).trim(),
        buyerEmail: buyer_email?.trim().toLowerCase() || `no-email-${code.toLowerCase()}@api.shipproof.net`,
        uniqueCode: code,
        videoData: video_data || null,
        videoHash,
        storageProvider,
        storageKey,
        fileSize,
        duration,
        sellerId: auth.id,
        status: video_data ? 'recorded' : 'pending',
      },
    })

    await incrementVideoCount(auth.id)

    // Fire webhook (fire-and-forget)
    if (auth.webhookUrl) {
      fireWebhook(auth.webhookUrl, 'video.created', {
        video_id: video.id,
        order_id: video.orderId,
        verification_code: video.uniqueCode,
        verification_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/v/${video.uniqueCode}`,
        video_hash: videoHash,
        created_at: video.createdAt,
      })
    }

    // Auto-send email if buyer_email provided and video_data exists
    let email_sent = false
    if (buyer_email && video_data) {
      try {
        const { sendProofEmail } = await import('@/lib/email')
        await sendProofEmail(video.id)
        email_sent = true
      } catch (err) {
        console.error('Auto-email failed:', err)
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        order_id: video.orderId,
        verification_code: video.uniqueCode,
        verification_url: `${baseUrl}/v/${video.uniqueCode}`,
        video_hash: videoHash,
        storage_provider: storageProvider,
        email_sent,
        created_at: video.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('API v1 video error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    )
  }
}

// GET: List videos for this seller
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { sellerId: auth.id }
    if (status) where.status = status

    const [videos, total] = await Promise.all([
      db.video.findMany({
        where,
        select: {
          id: true,
          orderId: true,
          uniqueCode: true,
          status: true,
          buyerEmail: true,
          buyerConfirmed: true,
          videoHash: true,
          createdAt: true,
          recordedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.video.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        videos: videos.map(v => ({
          id: v.id,
          order_id: v.orderId,
          verification_code: v.uniqueCode,
          status: v.status,
          buyer_email: v.buyerEmail,
          buyer_confirmed: v.buyerConfirmed,
          video_hash: v.videoHash,
          created_at: v.createdAt,
          recorded_at: v.recordedAt,
        })),
        pagination: {
          total,
          limit,
          offset,
        },
      },
    })
  } catch (error) {
    console.error('API v1 list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
