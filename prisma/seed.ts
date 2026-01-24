import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')
  const user = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      sessions: {
        create: {
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          token: "session-token-alice",
          id: "session-id-alice",
        }
      },
      id: "user-id-alice",
    }
  })

  console.log(user)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
