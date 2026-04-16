import { NextRequest, NextResponse } from 'next/server'
import { generateApiKey } from '@/lib/api-auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company_name, website } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }

    const existing = await db.seller.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const apiKey = generateApiKey()

    const seller = await db.seller.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        apiKey,
        brandName: company_name || name.trim(),
        plan: 'free',
        videoQuota: 50,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        plan: seller.plan,
        api_key: seller.apiKey,
        video_quota: seller.videoQuota,
        message: 'Your API key is ready. Start integrating with /api/v1/video',
        docs_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/docs`,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Seller registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
