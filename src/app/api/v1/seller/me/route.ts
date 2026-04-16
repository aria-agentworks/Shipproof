import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest, getRateLimit } from '@/lib/api-auth'
import { startOfMonth, startOfDay, endOfMonth, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    // Count videos this month
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const dayStart = startOfDay(now)
    const dayEnd = endOfDay(now)

    const [videosThisMonth, videosToday] = await Promise.all([
      db.video.count({
        where: {
          sellerId: auth.id,
          createdAt: { gte: monthStart, lte: monthEnd },
        },
      }),
      db.video.count({
        where: {
          sellerId: auth.id,
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      }),
    ])

    const limits = getRateLimit(auth.plan)
    const limitLabel = limits.videosPerMonth === -1 ? 'unlimited' : String(limits.videosPerMonth)

    return NextResponse.json({
      success: true,
      data: {
        id: auth.id,
        name: auth.name,
        email: auth.email,
        plan: auth.plan,
        usage: {
          videos_this_month: videosThisMonth,
          videos_today: videosToday,
          limit: limitLabel,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching seller info:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch seller info' } },
      { status: 500 }
    )
  }
}
