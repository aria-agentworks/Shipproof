import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const config: Record<string, unknown> = {
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    }
    if (process.env.S3_ENDPOINT) config.endpoint = process.env.S3_ENDPOINT
    s3Client = new S3Client(config as ConstructorParameters<typeof S3Client>[0])
  }
  return s3Client
}

export async function uploadToS3(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType: string = 'video/webm'
): Promise<string> {
  const client = getS3Client()
  const bucket = process.env.S3_BUCKET
  if (!bucket) throw new Error('S3_BUCKET not configured')

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: typeof data === 'string' ? Buffer.from(data, 'base64') : data,
    ContentType: contentType,
  }))

  const endpoint = process.env.S3_PUBLIC_URL
  return endpoint ? `${endpoint}/${key}` : key
}

export function getS3Configured(): boolean {
  return !!(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)
}
