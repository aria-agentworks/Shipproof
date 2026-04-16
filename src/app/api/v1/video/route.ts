import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateUniqueCode } from '@/lib/utils-shipproof'
import { authenticateSeller } from '@/lib/api-auth'
import { sendProofEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateSeller(request)
    if (auth instanceof NextResponse) return auth
    const { seller } = auth

    const body = await request.json()
    const { order_id, buyer_email, video_url, video_hash, video_data, send_email = true } = body

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    }

    if (!video_url && !video_data) {
      return NextResponse.json({ error: 'video_url or video_data is required' }, { status: 400 })
    }

    let hash = video_hash
    if (video_data && !hash) {
      const buffer = Buffer.from(video_data.replace(/^data:[^;]+;base64,/, ''), 'base64')
      hash = `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`
    }

    let uniqueCode = generateUniqueCode(8)
    let exists = await db.video.findUnique({ where: { uniqueCode } })
    let attempts = 0
    while (exists && attempts < 20) {
      uniqueCode = generateUniqueCode(8)
      exists = await db.video.findUnique({ where: { uniqueCode } })
      attempts++
    }

    const video = await db.video.create({
      data: {
        orderId: String(order_id).trim(),
        buyerEmail: buyer_email ? String(buyer_email).trim().toLowerCase() : null,
        videoData: video_data || null,
        videoFilename: video_url || null,
        uniqueCode,
        status: buyer_email && send_email ? 'sent' : 'recorded',
        sellerId: seller.id,
        videoHash: hash || null,
      },
    })

    if (buyer_email && send_email) {
      try { await sendProofEmail(video.id) } catch (emailErr) {
        console.error('Email send failed (non-blocking):', emailErr)
      }
    }

    if (seller.webhookUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
      fetch(seller.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'video.created',
          video_id: video.id,
          order_id: video.orderId,
          unique_code: video.uniqueCode,
          verification_url: `${baseUrl}/v/${video.uniqueCode}`,
          timestamp: video.recordedAt,
          hash: video.videoHash,
        }),
      }).catch(() => {})
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''

    return NextResponse.json({
      success: true,
      verification_url: `${baseUrl}/v/${video.uniqueCode}`,
      unique_code: video.uniqueCode,
      timestamp: video.recordedAt,
      hash: video.videoHash,
      video_id: video.id,
    })
  } catch (error) {
    console.error('API v1 video error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
