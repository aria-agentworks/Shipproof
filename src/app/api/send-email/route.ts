import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId } = body

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const video = await db.video.findUnique({ where: { id: videoId } })
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Update status to sent
    await db.video.update({
      where: { id: videoId },
      data: { status: 'sent' },
    })

    // For MVP: Log the email that would be sent
    // In production, swap with Resend API:
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({ from, to, subject, html })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shipproof.netlify.app'
    const verifyLink = `${baseUrl}/v/${video.uniqueCode}`

    console.log('=== EMAIL WOULD BE SENT ===')
    console.log(`To: ${video.buyerEmail}`)
    console.log(`Subject: Your order #${video.orderId} was packed`)
    console.log(`Verify Link: ${verifyLink}`)
    console.log('============================')

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      verifyLink,
      emailTo: video.buyerEmail,
      orderId: video.orderId,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
