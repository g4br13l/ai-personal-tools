import type { PrismaClient } from '../../generated/client/client'



export type MigrationFnT = (prisma: PrismaClient) => Promise<void>

export type MigrationT = {
  id: string
  run: MigrationFnT
}
