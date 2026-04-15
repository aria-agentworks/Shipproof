import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filepath = join(process.cwd(), 'uploads', 'videos', filename)

    try {
      await stat(filepath)
    } catch {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const fileBuffer = await readFile(filepath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'video/webm',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving video:', error)
    return NextResponse.json(
      { error: 'Failed to serve video' },
      { status: 500 }
    )
  }
}
