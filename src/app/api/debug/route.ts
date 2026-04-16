import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envInfo = {
      DATABASE_URL: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 40)}...` : 'UNDEFINED',
      DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? 'SET (' + process.env.DATABASE_AUTH_TOKEN.length + ' chars)' : 'UNDEFINED',
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'UNDEFINED',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    }
    return NextResponse.json(envInfo)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
