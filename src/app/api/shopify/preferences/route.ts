import { NextRequest, NextResponse } from 'next/server'
import { verifyShopifyHmac } from '@/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = searchParams.get('shop')
    const signature = searchParams.get('signature')

    // 1. Validate required params
    if (!shop || !signature) {
      return NextResponse.json(
        { error: 'Missing required parameters: shop, signature' },
        { status: 400 }
      )
    }

    // 2. Verify HMAC signature
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    if (!verifyShopifyHmac(params)) {
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      )
    }

    // 3. Return app configuration
    return NextResponse.json({
      appName: 'ShipProof',
      version: '1.0',
      scopes: 'read_orders,read_customers,read_products,read_fulfillments',
      description: 'Video proof of order packing — build trust, reduce disputes.',
      shop,
    })
  } catch (error) {
    console.error('Shopify preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to load preferences' },
      { status: 500 }
    )
  }
}
