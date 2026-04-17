import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const videosThisMonth = await db.video.count({
      where: { sellerId: auth.id, createdAt: { gte: monthStart } },
    })

    const emailsToday = await db.video.count({
      where: {
        sellerId: auth.id,
        status: 'sent',
        updatedAt: { gte: today },
      },
    })

    const limitLabel = auth.videoQuota === -1 ? 'unlimited' : String(auth.videoQuota)

    return NextResponse.json({
      videosThisMonth,
      emailsToday,
      plan: auth.plan,
      limits: {
        videosPerMonth: limitLabel,
        emailsPerDay: 3,
      },
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
