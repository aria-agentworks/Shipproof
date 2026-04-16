import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { authenticateApiKey } from '@/lib/api-auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request)
    if (!auth.authenticated || !auth.seller) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { file_name, content_type } = body || {}
    const fileName = file_name || 'video.webm'
    const contentType = content_type || 'video/webm'

    const bucket = process.env.S3_BUCKET
    if (!bucket) {
      return NextResponse.json({ error: 'S3 storage not configured. Contact support.' }, { status: 503 })
    }

    const objectKey = `videos/${auth.seller.id}/${crypto.randomUUID()}/${fileName}`

    const clientConfig: Record<string, unknown> = {
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    }
    if (process.env.S3_ENDPOINT) clientConfig.endpoint = process.env.S3_ENDPOINT

    const client = new S3Client(clientConfig as ConstructorParameters<typeof S3Client>[0])

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 3600 })
    const publicUrl = process.env.S3_PUBLIC_URL ? `${process.env.S3_PUBLIC_URL}/${objectKey}` : `s3://${bucket}/${objectKey}`

    return NextResponse.json({
      upload_url: presignedUrl,
      object_key: objectKey,
      public_url: publicUrl,
      expires_in: 3600,
    })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
