import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateSeller } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const auth = await authenticateSeller(request)
    if (auth instanceof NextResponse) return auth

    const { code } = await params
    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
      select: {
        id: true, orderId: true, buyerEmail: true, uniqueCode: true,
        status: true, buyerConfirmed: true, buyerConfirmedAt: true,
        packageCondition: true, buyerComment: true, recordedAt: true,
        videoHash: true, createdAt: true,
      },
    })

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
