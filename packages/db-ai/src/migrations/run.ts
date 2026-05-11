import { prisma } from '../prisma'
import { migration as m001 } from './scripts/001_add-job-description'



const migrations = [m001] as const

async function main() {
  for (const m of migrations) {
    console.log(`Running migration ${m.id}...`)
    await m.run(prisma)
    console.log(`Done ${m.id}`)
  }
}

main()
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
