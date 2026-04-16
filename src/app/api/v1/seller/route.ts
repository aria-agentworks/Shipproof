import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, generateApiKey } from '@/lib/api-auth'
import { db } from '@/lib/db'

// GET: Seller profile
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    return NextResponse.json({
      success: true,
      data: {
        id: auth.id,
        name: auth.name,
        email: auth.email,
        plan: auth.plan,
        brand_name: auth.brandName,
        brand_color: auth.brandColor,
        brand_logo: auth.brandLogo,
        custom_domain: auth.customDomain,
        webhook_url: auth.webhookUrl,
        video_quota: auth.videoQuota,
        videos_this_month: auth.videosThisMonth,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update seller settings
export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { brand_name, brand_color, brand_logo, custom_domain, webhook_url } = body

    const updated = await db.seller.update({
      where: { id: auth.id },
      data: {
        ...(brand_name && { brandName: brand_name }),
        ...(brand_color && { brandColor: brand_color }),
        ...(brand_logo && { brandLogo: brand_logo }),
        ...(custom_domain !== undefined && { customDomain: custom_domain || null }),
        ...(webhook_url !== undefined && { webhookUrl: webhook_url || null }),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        plan: updated.plan,
        brand_name: updated.brandName,
        brand_color: updated.brandColor,
        custom_domain: updated.customDomain,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Regenerate API key
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) return auth

    const newKey = generateApiKey()

    await db.seller.update({
      where: { id: auth.id },
      data: { apiKey: newKey },
    })

    return NextResponse.json({
      success: true,
      data: {
        api_key: newKey,
        warning: 'Your old API key is now invalid. Update your integrations.',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
