import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { createdAt: 'desc' },
      // Exclude videoData from list to keep response small
      select: {
        id: true,
        orderId: true,
        buyerEmail: true,
        videoFilename: true,
        uniqueCode: true,
        status: true,
        buyerConfirmed: true,
        buyerConfirmedAt: true,
        packageCondition: true,
        buyerComment: true,
        recordedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
