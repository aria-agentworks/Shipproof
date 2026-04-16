import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Env check
  results.env = {
    DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) : 'UNDEFINED',
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? 'SET' : 'UNDEFINED',
    NODE_ENV: process.env.NODE_ENV,
  }

  // DB connection test
  try {
    const count = await db.video.count()
    results.db = { status: 'connected', videoCount: count }
  } catch (e) {
    results.db = {
      status: 'FAILED',
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack?.substring(0, 500) : undefined,
    }
  }

  return NextResponse.json(results)
}
