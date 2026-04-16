import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export interface AuthenticatedSeller {
  id: string
  name: string
  email: string
  apiKey: string
  plan: string
}

/**
 * Authenticate requests to API v1 endpoints.
 * Expects: Authorization: Bearer <api_key>
 * Or: x-api-key: <api_key>
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedSeller | NextResponse> {
  const authHeader = request.headers.get('authorization')
  const apiKeyHeader = request.headers.get('x-api-key')

  let apiKey: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7)
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Authentication required. Provide API key via Authorization: Bearer <key> or x-api-key header.', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const seller = await db.seller.findUnique({
    where: { apiKey },
    select: { id: true, name: true, email: true, apiKey: true, plan: true },
  })

  if (!seller) {
    return NextResponse.json(
      { error: 'Invalid API key.', code: 'INVALID_KEY' },
      { status: 401 }
    )
  }

  return seller
}

/**
 * Rate limit helper based on seller plan
 */
export function getRateLimit(plan: string): { videosPerMonth: number; videosPerDay: number; videosPerHour: number } {
  const limits: Record<string, { videosPerMonth: number; videosPerDay: number; videosPerHour: number }> = {
    free:      { videosPerMonth: 5,   videosPerDay: 2,   videosPerHour: 1 },
    pro:       { videosPerMonth: 200, videosPerDay: 50,  videosPerHour: 10 },
    business:  { videosPerMonth: 5000, videosPerDay: 500, videosPerHour: 100 },
    enterprise: { videosPerMonth: -1, videosPerDay: -1, videosPerHour: -1 }, // unlimited
  }
  return limits[plan] || limits.free
}

/**
 * Compute SHA-256 hash of video data for tamper-proof verification
 */
export async function computeVideoHash(videoData: string): Promise<string> {
  const crypto = await import('crypto')
  return crypto.createHash('sha256').update(videoData).digest('hex')
}
