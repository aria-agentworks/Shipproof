import crypto from 'crypto'

// Generate SHA-256 hash of video data for tamper verification
export function hashVideoData(data: string | Buffer): string {
  const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

// Verify video data matches a stored hash
export function verifyVideoHash(data: string | Buffer, expectedHash: string): boolean {
  const hash = hashVideoData(data)
  return hash === expectedHash
}

// Generate a short verification code
export function generateVerificationCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing chars (I, O, 0, 1)
  const bytes = crypto.randomBytes(length)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}
