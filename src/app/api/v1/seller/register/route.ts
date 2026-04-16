import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'name is required' } },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'email is required and must be valid' } },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if seller with this email already exists
    const existing = await db.seller.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'A seller with this email already exists' } },
        { status: 409 }
      )
    }

    // Generate a secure API key
    const apiKey = randomBytes(32).toString('hex')

    const seller = await db.seller.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        apiKey,
        plan: 'free',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          api_key: seller.apiKey,
          name: seller.name,
          email: seller.email,
          plan: seller.plan,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering seller:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to register seller' } },
      { status: 500 }
    )
  }
}
