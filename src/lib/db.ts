import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Build Prisma client with Turso/libSQL adapter (serverless SQLite)
// Falls back to standard SQLite if DATABASE_URL starts with "file:"
function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db'

  if (dbUrl.startsWith('file:')) {
    // Local development: use standard SQLite with query logging
    return new PrismaClient({ log: ['error'] })
  }

  // Turso / remote libSQL
  const libsql = createClient({
    url: dbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  })

  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter, log: ['error'] })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

// In development, cache the client to survive hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
