
import type { JobPostingCreateInput } from '../../generated/client/models'
import {
  // JobPostingCreateOneSchema,
  JobPostingCreateInputObjectZodSchema,
  JobPostingDeleteOneSchema,
  JobPostingSchema,
  JobPostingUpdateOneSchema,
} from '../../generated/prisma-zod/schemas'
import type { JobPostingType } from '../../generated/prisma-zod/schemas/models/JobPosting.schema'



export type JobPostingTbT = JobPostingType
export type JobPostingInputT = JobPostingCreateInput



export const tbZodSchema = {
  JobPostingSchema: JobPostingSchema,
  JobPostingCreateSchema: JobPostingCreateInputObjectZodSchema,
  JobPostingUpdateOneSchema: JobPostingUpdateOneSchema,
  JobPostingDeleteOneSchema: JobPostingDeleteOneSchema,
}
