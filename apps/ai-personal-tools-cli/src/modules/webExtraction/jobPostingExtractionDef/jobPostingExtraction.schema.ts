import z from 'zod'
import { zodHelper, type ZodDescriptionT } from '@repo/infra/all'
import { jobPostingExtractionDesc } from './jobPostingExtraction.desc'
import { JobPostingShape } from '@repo/core/all'



const d = jobPostingExtractionDesc

const extractShape = {
  ...JobPostingShape,
  publishedAt: z.string().optional().nullable(),
}

type ExtractShapeT = typeof extractShape


export const jobPostingExtractSchema = z.object(
  zodHelper.addDescriptionsToShape(
    extractShape,
    {
      companyName: d.companyName,
      sourceUrl: d.sourceUrl,
      jobTitle: d.jobTitle,
      jobDescription: d.jobDescription,
      countriesHiring: d.countriesHiring,
      timezone: d.timezone,
      workModel: d.workModel,
      employmentType: d.employmentType,
      seniority: d.seniority,
      mainTechStack: d.mainTechStack,
      fullTechStack: d.fullTechStack,
      scope: d.scope,
      salaryCurrency: d.salaryCurrency,
      salaryFrom: d.salaryFrom,
      salaryTo: d.salaryTo,
      applicationUrl: d.applicationUrl,
      notes: d.notes,
      publishedAt: d.publishedAt,
    } satisfies ZodDescriptionT<ExtractShapeT>,
  ),
)
export type JobPostingExtractSchemaT = z.infer<typeof jobPostingExtractSchema>

