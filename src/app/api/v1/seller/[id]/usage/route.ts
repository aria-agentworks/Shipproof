import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateSeller } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateSeller(request)
    if (auth instanceof NextResponse) return auth

    const { id } = await params
    if (auth.seller.id !== id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const videosThisMonth = await db.video.count({
      where: { sellerId: id, createdAt: { gte: monthStart } },
    })

    const confirmedVideos = await db.video.count({
      where: { sellerId: id, buyerConfirmed: true },
    })

    const totalVideos = await db.video.count({ where: { sellerId: id } })

    return NextResponse.json({
      success: true,
      data: {
        videos_this_month: videosThisMonth,
        total_videos: totalVideos,
        confirmed_videos: confirmedVideos,
        plan: auth.seller.plan,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
