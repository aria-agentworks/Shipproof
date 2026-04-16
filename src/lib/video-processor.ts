import crypto from 'crypto'

export function hashVideoData(data: string | Buffer): string {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export function generateVerificationCode(): string {
  return crypto.randomBytes(6).toString('base64url').toUpperCase().slice(0, 8)
}
