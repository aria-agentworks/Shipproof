import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest, computeVideoHash } from '@/lib/api-auth'
import { generateUniqueCode } from '@/lib/utils-shipproof'

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const contentType = request.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')

    let orderId: string
    let buyerEmail: string | undefined
    let videoData: string | undefined
    let metadata: Record<string, unknown> | undefined

    if (isMultipart) {
      const formData = await request.formData()
      orderId = (formData.get('order_id') as string) || ''
      buyerEmail = (formData.get('buyer_email') as string) || undefined
      const videoFile = formData.get('video_file') as File | null

      if (!orderId.trim()) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'order_id is required' } },
          { status: 400 }
        )
      }

      if (videoFile) {
        const arrayBuffer = await videoFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        videoData = buffer.toString('base64')
      }
    } else {
      const body = await request.json()
      orderId = body.order_id || ''
      buyerEmail = body.buyer_email || undefined
      videoData = body.video_data || undefined
      metadata = body.metadata || undefined
    }

    if (!orderId.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'order_id is required' } },
        { status: 400 }
      )
    }

    if (!videoData) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'video_data or video_file is required' } },
        { status: 400 }
      )
    }

    // Generate unique code - ensure it doesn't already exist
    let uniqueCode = generateUniqueCode(6)
    let exists = await db.video.findUnique({ where: { uniqueCode } })
    let attempts = 0
    while (exists && attempts < 10) {
      uniqueCode = generateUniqueCode(6)
      exists = await db.video.findUnique({ where: { uniqueCode } })
      attempts++
    }

    if (exists) {
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Could not generate unique code. Please try again.' } },
        { status: 500 }
      )
    }

    // Compute SHA-256 hash for tamper-proof verification
    const videoHash = await computeVideoHash(videoData)

    const baseUrl = getBaseUrl()
    const verificationUrl = `${baseUrl}/api/v1/verify/${uniqueCode}`

    const video = await db.video.create({
      data: {
        orderId: orderId.trim(),
        buyerEmail: buyerEmail ? buyerEmail.trim().toLowerCase() : `${auth.id}@shipproof.internal`,
        videoData,
        uniqueCode,
        status: 'recorded',
        sellerId: auth.id,
        videoHash,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: video.id,
          order_id: video.orderId,
          unique_code: video.uniqueCode,
          verification_url: verificationUrl,
          video_hash: `sha256:${videoHash}`,
          created_at: video.createdAt.toISOString(),
          status: video.status,
          ...(metadata ? { metadata } : {}),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create video record' } },
      { status: 500 }
    )
  }
}
