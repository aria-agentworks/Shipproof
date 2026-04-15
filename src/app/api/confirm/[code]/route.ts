import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSellerNotification } from '@/lib/email'

const VALID_CONDITIONS = ['perfect', 'damaged', 'wrong_item', 'missing_parts']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { packageCondition, buyerComment } = body || {}

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

    const condition = packageCondition && VALID_CONDITIONS.includes(packageCondition)
      ? packageCondition
      : null

    const updated = await db.video.update({
      where: { uniqueCode: code.toUpperCase() },
      data: {
        buyerConfirmed: true,
        buyerConfirmedAt: new Date(),
        status: 'confirmed',
        ...(condition && { packageCondition: condition }),
        ...(buyerComment && { buyerComment: buyerComment.trim().substring(0, 500) }),
      },
    })

    // Notify seller (fire-and-forget — don't block the buyer response)
    sendSellerNotification(video.id, condition || null, buyerComment || null).catch(err => {
      console.error('Seller notification failed:', err)
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
