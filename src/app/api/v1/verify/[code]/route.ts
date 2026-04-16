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
    })

    if (!video) {
      return NextResponse.json({ error: 'Verification code not found' }, { status: 404 })
    }

    // Get seller branding if available
    let branding = null
    if (video.sellerId) {
      const seller = await db.seller.findUnique({
        where: { id: video.sellerId },
        select: {
          brandName: true,
          brandColor: true,
          brandLogo: true,
          customDomain: true,
        },
      })
      if (seller) branding = seller
    }

    return NextResponse.json({
      valid: true,
      data: {
        order_id: video.orderId,
        verification_code: video.uniqueCode,
        status: video.status,
        recorded_at: video.recordedAt,
        buyer_confirmed: video.buyerConfirmed,
        buyer_confirmed_at: video.buyerConfirmedAt,
        package_condition: video.packageCondition,
        video_hash: video.videoHash,
        has_video: !!video.videoData || !!video.storageKey,
        branding,
      },
    })
  } catch (error) {
    console.error('API v1 verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Confirm receipt (buyer-facing)
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
      return NextResponse.json({ error: 'Verification code not found' }, { status: 404 })
    }

    if (video.buyerConfirmed) {
      return NextResponse.json({ error: 'Already confirmed' }, { status: 400 })
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
        ...(buyer_comment && { buyerComment: String(buyer_comment).trim().substring(0, 500) }),
      },
    })

    // Fire webhook
    if (video.sellerId) {
      const seller = await db.seller.findUnique({
        where: { id: video.sellerId },
        select: { webhookUrl: true },
      })
      if (seller?.webhookUrl) {
        fetch(seller.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'buyer.confirmed',
            data: {
              video_id: video.id,
              order_id: video.orderId,
              verification_code: video.uniqueCode,
              condition: condition,
              comment: buyer_comment || null,
              confirmed_at: updated.buyerConfirmedAt,
            },
          }),
        }).catch(() => {})
      }
    }

    // Send seller notification email
    try {
      const { sendSellerNotification } = await import('@/lib/email')
      await sendSellerNotification(video.id, condition, buyer_comment || null)
    } catch (err) {
      console.error('Seller notification failed:', err)
    }

    return NextResponse.json({
      success: true,
      data: {
        confirmed: true,
        confirmation_id: updated.id,
        confirmed_at: updated.buyerConfirmedAt,
      },
    })
  } catch (error) {
    console.error('API v1 confirm error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
