import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = searchParams.get('shop')
    const signature = searchParams.get('signature')

    // 1. Extract and validate required params
    if (!shop) {
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      )
    }

    // 2. Verify the shop domain exists in our database
    const shopDomain = shop.replace(/\/+$/, '').toLowerCase()
    const shopifyShop = await db.shopifyShop.findUnique({
      where: { shopDomain },
    })

    if (!shopifyShop || !shopifyShop.isActive) {
      return NextResponse.json(
        { error: 'Shop not found or not active' },
        { status: 404 }
      )
    }

    // 3. Return app proxy response
    return NextResponse.json({
      app: 'ShipProof',
      version: '1.0',
      message: 'ShipProof is active on this store. Go to your ShipProof dashboard to manage verifications.',
      shop_domain: shopifyShop.shopDomain,
      installed_at: shopifyShop.installedAt,
    })
  } catch (error) {
    console.error('Shopify proxy error:', error)
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}
