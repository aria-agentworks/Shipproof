import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { name, email, webhook_url } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'name and email are required' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await db.seller.findUnique({ where: { email: normalizedEmail } })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Seller already exists',
        data: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          api_key: existing.apiKey,
          plan: existing.plan,
        },
      })
    }

    const apiKey = `sp_live_${crypto.randomBytes(24).toString('hex')}`

    const seller = await db.seller.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        apiKey,
        plan: 'free',
        webhookUrl: webhook_url || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Seller account created',
      data: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        api_key: seller.apiKey,
        plan: seller.plan,
      },
    })
  } catch (error) {
    console.error('Seller registration error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create seller' }, { status: 500 })
  }
}
