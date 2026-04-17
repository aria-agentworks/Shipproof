import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const videos = await db.video.findMany({
      where: { sellerId: auth.id },
      orderBy: { createdAt: 'desc' },
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
