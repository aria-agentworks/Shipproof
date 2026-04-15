import { randomBytes } from 'crypto'

export function generateUniqueCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing chars (0/O, 1/I/L)
  let code = ''
  const bytes = randomBytes(length)
  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
