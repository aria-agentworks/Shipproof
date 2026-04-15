import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const videosThisMonth = await db.video.count({
      where: { createdAt: { gte: monthStart } },
    })

    const emailsToday = await db.video.count({
      where: {
        status: 'sent',
        updatedAt: { gte: today },
      },
    })

    return NextResponse.json({
      videosThisMonth,
      emailsToday,
      plan: 'free', // Default to free; upgrade via payment
      limits: {
        videosPerMonth: 5,
        emailsPerDay: 3,
      },
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
