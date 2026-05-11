import type { MigrationT } from '../migration.types'



export const migration: MigrationT = {
  id: '001_add-job-description',
  run: async (prisma) => {
    await prisma.$runCommandRaw({
      update: 'job_postings',
      updates: [
        {
          q: { job_description: { $exists: false } },
          u: { $set: { job_description: '' } },
          multi: true,
        },
      ],
    })
  },
}
