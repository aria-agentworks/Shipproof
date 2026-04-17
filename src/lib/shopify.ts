import crypto from 'crypto'

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL || 'https://shipproof.netlify.app'
const SHOPIFY_API_VERSION = '2026-04'
const SHOPIFY_SCOPES = 'read_orders,read_customers,read_products,read_fulfillments'

/**
 * Verifies the HMAC from Shopify's callback to prevent tampering.
 * Sort all params (except hmac and signature), concatenate key=value pairs with &,
 * compute HMAC-SHA256 using SHOPIFY_CLIENT_SECRET, compare.
 */
export function verifyShopifyHmac(params: Record<string, string>): boolean {
  const hmac = params.hmac || params.signature
  if (!hmac) return false

  const sortedParams = Object.entries(params)
    .filter(([key]) => key !== 'hmac' && key !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const computedHmac = crypto
    .createHmac('sha256', SHOPIFY_CLIENT_SECRET)
    .update(sortedParams)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(hmac, 'hex'),
    Buffer.from(computedHmac, 'hex')
  )
}

/**
 * Returns the Shopify OAuth authorization URL.
 */
export function buildShopifyAuthUrl(shopDomain: string, state: string): string {
  const shop = shopDomain.replace(/\/+$/, '')
  const redirectUri = `${SHOPIFY_APP_URL}/api/auth/shopify/callback`

  const params = new URLSearchParams({
    client_id: SHOPIFY_CLIENT_ID,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
  })

  return `https://${shop}/admin/oauth/authorize?${params.toString()}`
}

/**
 * Exchanges the OAuth code for an access token.
 */
export async function exchangeCodeForToken(
  shopDomain: string,
  code: string
): Promise<{ access_token: string; scope: string }> {
  const shop = shopDomain.replace(/\/+$/, '')
  const url = `https://${shop}/admin/oauth/access_token`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to exchange code for token: ${response.status} ${text}`)
  }

  return response.json() as Promise<{ access_token: string; scope: string }>
}

/**
 * Fetches orders from Shopify for a given shop.
 */
export async function fetchShopifyOrders(
  shopDomain: string,
  accessToken: string,
  params?: { limit?: number; status?: string }
): Promise<any[]> {
  const shop = shopDomain.replace(/\/+$/, '')
  const searchParams = new URLSearchParams({
    limit: String(params?.limit || 25),
    status: params?.status || 'any',
  })

  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to fetch orders: ${response.status} ${text}`)
  }

  const data = await response.json()
  return data.orders || []
}

/**
 * Installs a script tag on the merchant's storefront.
 * This auto-installs the Trust Widget on the merchant's storefront.
 */
export async function installScriptTag(
  shopDomain: string,
  accessToken: string
): Promise<void> {
  const shop = shopDomain.replace(/\/+$/, '')
  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/script_tags.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      script_tag: {
        src: `${SHOPIFY_APP_URL}/widget.js`,
        event: 'onload',
        display_scope: 'online_store',
      },
    }),
  })

  if (!response.ok) {
    // Script tag installation is non-critical, log but don't throw
    const text = await response.text()
    console.warn(`Failed to install script tag: ${response.status} ${text}`)
  }
}

/**
 * Fetches shop info (name, email, domain) from Shopify.
 */
export async function fetchShopInfo(
  shopDomain: string,
  accessToken: string
): Promise<{ shop: { name: string; email: string; domain: string; myshopify_domain: string } }> {
  const shop = shopDomain.replace(/\/+$/, '')
  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to fetch shop info: ${response.status} ${text}`)
  }

  return response.json() as Promise<{
    shop: { name: string; email: string; domain: string; myshopify_domain: string }
  }>
}

/**
 * Validates a shop domain format.
 */
export function isValidShopDomain(domain: string): boolean {
  const cleaned = domain.replace(/\/+$/, '').toLowerCase()
  return cleaned.endsWith('.myshopify.com') && cleaned.includes('.')
}
