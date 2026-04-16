import { PrismaClient } from '@prisma/client'

// Prisma v6 natively supports libsql:// URLs via @libsql/client
// DATABASE_URL in .env / Netlify env vars points to Turso

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

// In development, cache the client to survive hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
