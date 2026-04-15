import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!/^[A-Za-z0-9]+$/.test(code)) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const video = await db.video.findUnique({
      where: { uniqueCode: code.toUpperCase() },
      select: { videoData: true, videoFilename: true },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Prefer base64 videoData (works on serverless/Netlify)
    if (video.videoData) {
      const base64Match = video.videoData.match(/^data:([^;]+);base64,(.+)$/)
      if (base64Match) {
        const mimeType = base64Match[1]
        const buffer = Buffer.from(base64Match[2], 'base64')
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }

    // Fallback: filesystem video (legacy)
    if (video.videoFilename) {
      const { readFile, stat } = await import('fs/promises')
      const { join } = await import('path')
      const filepath = join(process.cwd(), 'uploads', 'videos', video.videoFilename)

      try { await stat(filepath) } catch {
        return NextResponse.json({ error: 'Video file not found' }, { status: 404 })
      }

      const fileBuffer = await readFile(filepath)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'video/webm',
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return NextResponse.json({ error: 'No video data available' }, { status: 404 })
  } catch (error) {
    console.error('Error serving video data:', error)
    return NextResponse.json({ error: 'Failed to serve video' }, { status: 500 })
  }
}
