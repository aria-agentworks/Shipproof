import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'
import { generateUniqueCode } from '@/lib/utils-shipproof'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { orderId, buyerEmail, videoData, videoFilename } = body

    if (!orderId || !buyerEmail) {
      return NextResponse.json(
        { error: 'Order ID and buyer email are required' },
        { status: 400 }
      )
    }

    if (!videoData && !videoFilename) {
      return NextResponse.json(
        { error: 'Video data or filename is required' },
        { status: 400 }
      )
    }

    // Generate unique code - ensure it doesn't already exist
    let uniqueCode = generateUniqueCode(6)
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
        videoData: videoData || null,
        videoFilename: videoFilename || null,
        uniqueCode,
        sellerId: auth.id,
        status: 'recorded',
      },
    })

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
