import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VALID_CONDITIONS = ['perfect', 'damaged', 'wrong_item', 'missing_parts']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
      select: {
        orderId: true,
        uniqueCode: true,
        status: true,
        videoHash: true,
        buyerConfirmed: true,
        buyerConfirmedAt: true,
        packageCondition: true,
        buyerComment: true,
        recordedAt: true,
      },
    })

    if (!video) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Verification record not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: video.orderId,
        unique_code: video.uniqueCode,
        video_hash: video.videoHash ? `sha256:${video.videoHash}` : null,
        status: video.status,
        recorded_at: video.recordedAt.toISOString(),
        buyer_confirmed: video.buyerConfirmed,
        buyer_confirmed_at: video.buyerConfirmedAt?.toISOString() || null,
        package_condition: video.packageCondition,
        buyer_comment: video.buyerComment,
      },
    })
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to verify code' } },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { package_condition, buyer_comment } = body || {}

    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
    })

    if (!video) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Verification record not found' } },
        { status: 404 }
      )
    }

    if (video.buyerConfirmed) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_CONFIRMED', message: 'This package has already been confirmed' } },
        { status: 400 }
      )
    }

    const condition = package_condition && VALID_CONDITIONS.includes(package_condition)
      ? package_condition
      : null

    const updated = await db.video.update({
      where: { uniqueCode: code.toUpperCase() },
      data: {
        buyerConfirmed: true,
        buyerConfirmedAt: new Date(),
        status: 'confirmed',
        ...(condition && { packageCondition: condition }),
        ...(buyer_comment && { buyerComment: buyer_comment.trim().substring(0, 500) }),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        confirmed: true,
        confirmed_at: updated.buyerConfirmedAt!.toISOString(),
        package_condition: updated.packageCondition,
      },
    })
  } catch (error) {
    console.error('Error confirming receipt:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to confirm receipt' } },
      { status: 500 }
    )
  }
}
