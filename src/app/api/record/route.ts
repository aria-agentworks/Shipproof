import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateUniqueCode } from '@/lib/utils-shipproof'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, buyerEmail, videoFilename, uniqueCode: providedCode } = body

    if (!orderId || !buyerEmail || !videoFilename) {
      return NextResponse.json(
        { error: 'Order ID, email, and video filename are required' },
        { status: 400 }
      )
    }

    // Generate unique code - ensure it doesn't already exist
    let uniqueCode = providedCode || generateUniqueCode(6)
    let exists = await db.video.findUnique({ where: { uniqueCode } })
    let attempts = 0
    while (exists && attempts < 10) {
      uniqueCode = generateUniqueCode(6)
      exists = await db.video.findUnique({ where: { uniqueCode } })
      attempts++
    }

    if (exists) {
      return NextResponse.json(
        { error: 'Could not generate unique code. Please try again.' },
        { status: 500 }
      )
    }

    const video = await db.video.create({
      data: {
        orderId: orderId.trim(),
        buyerEmail: buyerEmail.trim().toLowerCase(),
        videoFilename,
        uniqueCode,
        status: 'recorded',
      },
    })

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
