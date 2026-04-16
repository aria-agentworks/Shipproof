import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey, fireWebhook } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request)
    if (!auth.authenticated || !auth.seller) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { test_url } = body || {}
    const targetUrl = test_url || auth.seller.webhookUrl

    if (!targetUrl) {
      return NextResponse.json({ error: 'No webhook URL configured.' }, { status: 400 })
    }

    await fireWebhook(targetUrl, 'webhook.test', {
      seller_id: auth.seller.id,
      message: 'Webhook test from ShipProof API',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Test webhook fired.', target_url: targetUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
