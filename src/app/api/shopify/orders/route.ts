import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { fetchShopifyOrders } from '@/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate using authenticateRequest
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    // 2. Look up ShopifyShop by sellerId
    const shopifyShop = await db.shopifyShop.findFirst({
      where: {
        sellerId: auth.id,
        isActive: true,
      },
    })

    // 3. If not found, return 404
    if (!shopifyShop) {
      return NextResponse.json(
        { error: 'No Shopify shop connected to this account' },
        { status: 404 }
      )
    }

    // 4. Fetch orders from Shopify
    const orders = await fetchShopifyOrders(shopifyShop.shopDomain, shopifyShop.accessToken, {
      limit: 25,
      status: 'any',
    })

    // 5. Return orders with key info
    const mappedOrders = orders.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      email: order.email,
      buyer_email: order.email,
      item_count: order.line_items?.length || 0,
      line_items: (order.line_items || []).map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        sku: item.sku,
        price: item.price,
      })),
      financial_status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      total_price: order.total_price,
      currency: order.currency,
      created_at: order.created_at,
      order_id: String(order.order_number),
    }))

    return NextResponse.json({
      success: true,
      data: {
        orders: mappedOrders,
        shop_domain: shopifyShop.shopDomain,
        total: mappedOrders.length,
      },
    })
  } catch (error) {
    console.error('Shopify orders fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch orders from Shopify',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
