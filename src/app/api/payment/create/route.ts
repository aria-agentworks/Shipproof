import { NextRequest, NextResponse } from 'next/server'
import { createOrder, PLANS, type PlanKey, type Currency } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const { planKey, currency } = await request.json() as { planKey: PlanKey; currency: Currency }

    if (!PLANS[planKey]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (PLANS[planKey].price[currency as keyof typeof PLANS[typeof planKey]['price']] === 0) {
      return NextResponse.json({ error: 'Free plan does not require payment' }, { status: 400 })
    }

    const order = await createOrder(planKey, currency)
    if (!order) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 })
    }

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
      planKey,
      currency,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
