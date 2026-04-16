import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api-auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const { id } = await params

    const video = await db.video.findFirst({
      where: { id, sellerId: auth.id },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        order_id: video.orderId,
        verification_code: video.uniqueCode,
        status: video.status,
        buyer_email: video.buyerEmail,
        buyer_confirmed: video.buyerConfirmed,
        buyer_confirmed_at: video.buyerConfirmedAt,
        package_condition: video.packageCondition,
        buyer_comment: video.buyerComment,
        video_hash: video.videoHash,
        storage_provider: video.storageProvider,
        file_size: video.fileSize,
        duration: video.duration,
        verification_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/v/${video.uniqueCode}`,
        created_at: video.createdAt,
        recorded_at: video.recordedAt,
      },
    })
  } catch (error) {
    console.error('API v1 video get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
