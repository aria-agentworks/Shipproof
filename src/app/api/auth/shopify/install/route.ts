import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { buildShopifyAuthUrl, isValidShopDomain } from '@/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = searchParams.get('shop')

    if (!shop) {
      return NextResponse.json(
        { error: 'Missing required parameter: shop' },
        { status: 400 }
      )
    }

    // Validate shop domain format
    const shopDomain = shop.replace(/\/+$/, '').toLowerCase()
    if (!isValidShopDomain(shopDomain)) {
      return NextResponse.json(
        { error: 'Invalid shop domain format. Must end with .myshopify.com' },
        { status: 400 }
      )
    }

    // Generate a random state token for CSRF protection
    const state = crypto.randomBytes(32).toString('hex')

    // Build the Shopify OAuth authorization URL
    const authUrl = buildShopifyAuthUrl(shopDomain, state)

    // Redirect (302) to the Shopify auth URL
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Shopify install redirect error:', error)
    return NextResponse.json(
      {
        error: 'Failed to initiate Shopify installation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
