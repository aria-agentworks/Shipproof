import { NextRequest, NextResponse } from 'next/server'
import { sendProofEmail } from '@/lib/email'

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

    const result = await sendProofEmail(videoId)

    return NextResponse.json({
      success: true,
      message: result.sent
        ? 'Email sent successfully'
        : 'Saved (email not configured — see Netlify env vars)',
      ...result,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
