import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/payment'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const isValid = verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Store payment record
    await db.payment.create({
      data: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        planKey: planKey || 'pro',
        status: 'completed',
        amount: 0, // Amount is in Razorpay dashboard
      },
    })

    return NextResponse.json({ success: true, message: 'Payment verified successfully' })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
