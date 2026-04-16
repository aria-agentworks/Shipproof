import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const status = searchParams.get('status') || undefined
    const orderId = searchParams.get('order_id') || undefined

    const where: Record<string, unknown> = { sellerId: auth.id }

    if (status) {
      where.status = status
    }

    if (orderId) {
      where.orderId = { contains: orderId, mode: 'insensitive' }
    }

    const skip = (page - 1) * limit

    const [videos, total] = await Promise.all([
      db.video.findMany({
        where,
        select: {
          id: true,
          orderId: true,
          buyerEmail: true,
          uniqueCode: true,
          status: true,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.video.count({ where }),
    ])

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''

    return NextResponse.json({
      success: true,
      data: {
        videos: videos.map((v) => ({
          id: v.id,
          order_id: v.orderId,
          buyer_email: v.buyerEmail,
          unique_code: v.uniqueCode,
          verification_url: `${baseUrl}/api/v1/verify/${v.uniqueCode}`,
          video_hash: v.videoHash ? `sha256:${v.videoHash}` : null,
          status: v.status,
          buyer_confirmed: v.buyerConfirmed,
          buyer_confirmed_at: v.buyerConfirmedAt?.toISOString() || null,
          package_condition: v.packageCondition,
          buyer_comment: v.buyerComment,
          recorded_at: v.recordedAt.toISOString(),
          created_at: v.createdAt.toISOString(),
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
          has_next: skip + limit < total,
          has_prev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch videos' } },
      { status: 500 }
    )
  }
}
