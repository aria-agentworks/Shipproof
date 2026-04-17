import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authenticateRequest } from '@/lib/api-auth'
import { generateCertificatePDF } from '@/lib/certificate'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const auth = await authenticateRequest(request)

    // If auth returned a NextResponse (error), return it
    if (auth instanceof NextResponse) {
      return auth
    }

    const { code } = await params

    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
      include: {
        seller: {
          select: { id: true, name: true },
        },
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (video.sellerId !== auth.id) {
      return NextResponse.json(
        { error: 'You do not have permission to access this certificate' },
        { status: 403 }
      )
    }

    const pdfBuffer = await generateCertificatePDF({
      orderId: video.orderId,
      uniqueCode: video.uniqueCode,
      status: video.status,
      buyerConfirmed: video.buyerConfirmed,
      buyerConfirmedAt: video.buyerConfirmedAt?.toISOString() ?? null,
      packageCondition: video.packageCondition,
      buyerComment: video.buyerComment,
      recordedAt: video.recordedAt.toISOString(),
      videoHash: video.videoHash,
      sellerName: video.seller?.name ?? undefined,
      buyerEmail: video.buyerEmail,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="shipproof-${code}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}
