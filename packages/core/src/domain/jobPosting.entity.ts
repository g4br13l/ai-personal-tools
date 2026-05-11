import z from 'zod'



export const WorkModel = z.enum([
  'REMOTE',
  'HYBRID',
  'ONSITE',
  'FLEXIBLE',
  'NOT_FOUND'])
export type WorkModelT = z.infer<typeof WorkModel>

export const EmploymentType = z.enum([
  'FULL_TIME',
  'CONTRACT',
  'PART_TIME',
  'B2B',
  'PJ',
  'CLT',
  'NOT_FOUND'])
export type EmploymentTypeT = z.infer<typeof EmploymentType>

export const Seniority = z.enum([
  'JUNIOR',
  'MID_LEVEL',
  'SENIOR',
  'STAFF_SPECIALIST',
  'PRINCIPAL',
  'NOT_FOUND'])
export type SeniorityT = z.infer<typeof Seniority>


export const JobPostingShape = {
  companyName: z.string(),
  sourceUrl: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  countriesHiring: z.array(z.string()),
  timezone: z.string().nullable(),
  workModel: WorkModel,
  employmentType: EmploymentType,
  seniority: Seniority,
  mainTechStack: z.array(z.string()),
  fullTechStack: z.array(z.string()),
  scope: z.array(z.string()),
  salaryCurrency: z.string(),
  salaryFrom: z.number(),
  salaryTo: z.number(),
  notes: z.string(),
  applicationUrl: z.string(),
  publishedAt: z.date().nullable(),
} as const

export const JobPostingSchema = z.object(JobPostingShape)
export type JobPostingEntityT = z.infer<typeof JobPostingSchema>
