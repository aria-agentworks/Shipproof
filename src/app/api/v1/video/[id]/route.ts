import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const { id } = await params

    const video = await db.video.findUnique({
      where: { id },
      select: {
        id: true,
        orderId: true,
        buyerEmail: true,
        uniqueCode: true,
        status: true,
        videoFilename: true,
        buyerConfirmed: true,
        buyerConfirmedAt: true,
        packageCondition: true,
        buyerComment: true,
        recordedAt: true,
        createdAt: true,
        updatedAt: true,
        sellerId: true,
        videoHash: true,
      },
    })

    if (!video) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Video not found' } },
        { status: 404 }
      )
    }

    // Ensure the video belongs to the requesting seller
    if (video.sellerId && video.sellerId !== auth.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You do not have access to this video' } },
        { status: 403 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''

    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        order_id: video.orderId,
        buyer_email: video.buyerEmail,
        unique_code: video.uniqueCode,
        verification_url: `${baseUrl}/api/v1/verify/${video.uniqueCode}`,
        video_hash: video.videoHash ? `sha256:${video.videoHash}` : null,
        status: video.status,
        buyer_confirmed: video.buyerConfirmed,
        buyer_confirmed_at: video.buyerConfirmedAt?.toISOString() || null,
        package_condition: video.packageCondition,
        buyer_comment: video.buyerComment,
        recorded_at: video.recordedAt.toISOString(),
        created_at: video.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch video' } },
      { status: 500 }
    )
  }
}
