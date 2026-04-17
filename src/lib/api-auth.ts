import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export interface AuthenticatedSeller {
  id: string
  name: string
  email: string
  plan: string
  brandName: string | null
  brandColor: string | null
  brandLogo: string | null
  customDomain: string | null
  webhookUrl: string | null
  videoQuota: number
  videosThisMonth: number
}

// Authenticate requests via X-API-Key header or Bearer token
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedSeller | NextResponse> {
  const authHeader = request.headers.get('authorization')
  const apiKeyHeader = request.headers.get('x-api-key')

  let apiKey = apiKeyHeader

  // Support Bearer token format
  if (!apiKey && authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7)
  }

  // Support cookie-based auth (for web app dashboard/record pages)
  if (!apiKey) {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.match(/(?:^|;\s*)sp_api_key=([^;]*)/)
    if (match?.[1]) {
      apiKey = decodeURIComponent(match[1])
    }
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing API key. Include X-API-Key header or Authorization: Bearer <key>' },
      { status: 401 }
    )
  }

  const seller = await db.seller.findUnique({
    where: { apiKey },
  })

  if (!seller || !seller.isActive) {
    return NextResponse.json(
      { error: 'Invalid or inactive API key' },
      { status: 401 }
    )
  }

  // Check monthly quota
  if (seller.videoQuota !== -1 && seller.videosThisMonth >= seller.videoQuota) {
    return NextResponse.json(
      { error: 'Monthly video quota exceeded. Upgrade your plan.', code: 'QUOTA_EXCEEDED' },
      { status: 429 }
    )
  }

  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    plan: seller.plan,
    brandName: seller.brandName,
    brandColor: seller.brandColor,
    brandLogo: seller.brandLogo,
    customDomain: seller.customDomain,
    webhookUrl: seller.webhookUrl,
    videoQuota: seller.videoQuota,
    videosThisMonth: seller.videosThisMonth,
  }
}

// Legacy auth function for backward compatibility
export async function authenticateApiKey(request: NextRequest): Promise<{ authenticated: boolean; seller?: { id: string; name: string; plan: string; webhookUrl: string | null }; error?: string }> {
  const auth = await authenticateRequest(request)
  if (auth instanceof NextResponse) {
    return { authenticated: false, error: 'Unauthorized' }
  }
  return {
    authenticated: true,
    seller: {
      id: auth.id,
      name: auth.name,
      plan: auth.plan,
      webhookUrl: auth.webhookUrl,
    },
  }
}

// Generate a secure API key
export function generateApiKey(): string {
  return `sp_live_${crypto.randomBytes(24).toString('hex')}`
}

// Increment seller's monthly video count
export async function incrementVideoCount(sellerId: string): Promise<void> {
  await db.seller.update({
    where: { id: sellerId },
    data: { videosThisMonth: { increment: 1 } },
  })
}

// Fire webhook (fire-and-forget)
export function fireWebhook(webhookUrl: string, event: string, data: Record<string, unknown>) {
  if (!webhookUrl) return
  try {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, timestamp: new Date().toISOString(), data }),
    }).catch(() => {})
  } catch {
    // Fire-and-forget
  }
}
