import type { JobPostingEntityT } from '@repo/core/all'
import { prisma } from '../prisma'
// import type { Prisma } from '../../generated/client'



// type JobPostingCreateInputT =
//   Omit<Prisma.JobPostingCreateInput, 'id' | 'createdAt' | 'updatedAt'>


export function jobPostingRepo() {

  async function add(data: JobPostingEntityT) {

    // loadEnvFromRoot()
    const res = await prisma.jobPosting.create({ data })
    return { jobPostingAddedId: res.id }
  }


  return { add }
}



// await jobPostingRepo().add({
//   companyName: 'Kraken',
//   sourceUrl: 'https://jobs.ashbyhq.com/kraken.com/role-id',
//   jobTitle: 'Senior Frontend Engineer',
//   countriesHiring: ['US', 'BR'],
//   timezone: 'America/New_York',
//   workModel: 'REMOTE', // Prisma enum value
//   employmentType: 'FULL_TIME',
//   seniority: 'SENIOR',
//   mainTechStack: ['React', 'TypeScript'],
//   fullTechStack: ['React', 'TypeScript', 'Node.js'],
//   scope: ['Frontend ownership', 'Mentorship'],
//   salaryCurrency: 'USD',
//   salaryFrom: 140000,
//   salaryTo: 180000,
//   applicationUrl: 'https://jobs.ashbyhq.com/kraken.com/apply',
//   notes: 'Remote-friendly team ...',
//   publishedAt: new Date('2026-03-15T00:00:00.000Z'),
// })


