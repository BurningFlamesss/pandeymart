import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from './generated/prisma/client.js'

declare global {
  var __prisma: PrismaClient | undefined
  var __pool: Pool | undefined
}

const pool =
  globalThis.__pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })

const adapter = new PrismaPg(pool)

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    adapter,
    transactionOptions: {
      maxWait: 10_000, 
      timeout: 30_000, 
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pool = pool
  globalThis.__prisma = prisma
}