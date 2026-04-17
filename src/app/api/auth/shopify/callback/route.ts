import { NextRequest, NextResponse } from 'next/server'
import { verifyShopifyHmac, exchangeCodeForToken, fetchShopInfo, installScriptTag, isValidShopDomain } from '@/lib/shopify'
import { db } from '@/lib/db'
import { generateApiKey } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = searchParams.get('shop')
    const code = searchParams.get('code')
    const hmac = searchParams.get('hmac')
    const state = searchParams.get('state')

    // 1. Validate required params
    if (!shop || !code || !hmac) {
      return NextResponse.json(
        { error: 'Missing required parameters: shop, code, hmac' },
        { status: 400 }
      )
    }

    // 2. Verify HMAC
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    if (!verifyShopifyHmac(params)) {
      return NextResponse.json(
        { error: 'HMAC verification failed. Request may have been tampered with.' },
        { status: 400 }
      )
    }

    // 3. Validate shop domain format
    const shopDomain = shop.replace(/\/+$/, '').toLowerCase()
    if (!isValidShopDomain(shopDomain)) {
      return NextResponse.json(
        { error: 'Invalid shop domain format. Must end with .myshopify.com' },
        { status: 400 }
      )
    }

    // 4. Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(shopDomain, code)
    const { access_token, scope } = tokenResponse

    // 5. Fetch shop info
    const shopInfo = await fetchShopInfo(shopDomain, access_token)

    // 6. Check if ShopifyShop already exists
    const existingShop = await db.shopifyShop.findUnique({
      where: { shopDomain },
      include: { seller: true },
    })

    if (existingShop) {
      // Update existing shop's access token and scope
      await db.shopifyShop.update({
        where: { shopDomain },
        data: {
          accessToken: access_token,
          scope,
          isActive: true,
        },
      })
    } else {
      // Create a new Seller and ShopifyShop
      const apiKey = generateApiKey()

      const seller = await db.seller.create({
        data: {
          name: shopInfo.shop.name || shopDomain,
          email: shopInfo.shop.email || `shopify@${shopDomain}`,
          apiKey,
          plan: 'free',
          videoQuota: 50,
          brandName: shopInfo.shop.name || shopDomain,
          brandColor: '#059669',
          isActive: true,
        },
      })

      await db.shopifyShop.create({
        data: {
          shopDomain,
          accessToken: access_token,
          scope,
          sellerId: seller.id,
          isActive: true,
        },
      })
    }

    // 7. Install the Trust Widget script tag (non-blocking)
    installScriptTag(shopDomain, access_token).catch((err) => {
      console.error('Script tag installation failed (non-critical):', err)
    })

    // 8. Redirect to the Shopify embedded page
    const redirectUrl = `/shopify?shop=${encodeURIComponent(shopDomain)}&installed=true`
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('Shopify OAuth callback error:', error)
    return NextResponse.json(
      {
        error: 'OAuth callback failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
