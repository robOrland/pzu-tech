import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { env } from './config/env'

const pool = new Pool({
  user: env.DATABASE_USER,
  host: env.DATABASE_HOST,
  database: env.DATABASE_DB,
  password: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
  ssl: true // Necessário para db.prisma.io
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma