import { envConfig } from '../../../envConfig'
import { PrismaClient } from '../generated/client/client'
// import { PrismaClient } from '../generated/client'



export const prisma = new PrismaClient()

const globalForPrisma = global as unknown as { prisma: typeof prisma }
if (envConfig.ENV !== 'prod') globalForPrisma.prisma = prisma
