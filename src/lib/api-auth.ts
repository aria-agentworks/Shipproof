import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export interface AuthenticatedSeller {
  id: string
  name: string
  email: string
  plan: string
}

export async function authenticateSeller(request: NextRequest): Promise<{ seller: AuthenticatedSeller } | NextResponse> {
  const authHeader = request.headers.get('authorization')
  const apiKeyHeader = request.headers.get('x-api-key')

  let apiKey = apiKeyHeader

  if (!apiKey && authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7)
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing API key. Include X-API-Key header or Authorization: Bearer <key>' },
      { status: 401 }
    )
  }

  const seller = await db.seller.findUnique({ where: { apiKey } })

  if (!seller) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  return { seller: { id: seller.id, name: seller.name, email: seller.email, plan: seller.plan } }
}
