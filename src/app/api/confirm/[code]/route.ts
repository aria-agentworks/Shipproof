import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    if (video.buyerConfirmed) {
      return NextResponse.json(
        { error: 'This package has already been confirmed' },
        { status: 400 }
      )
    }

    const updated = await db.video.update({
      where: { uniqueCode: code.toUpperCase() },
      data: {
        buyerConfirmed: true,
        buyerConfirmedAt: new Date(),
        status: 'confirmed',
      },
    })

    return NextResponse.json({ video: updated, message: 'Receipt confirmed successfully!' })
  } catch (error) {
    console.error('Error confirming receipt:', error)
    return NextResponse.json(
      { error: 'Failed to confirm receipt' },
      { status: 500 }
    )
  }
}
