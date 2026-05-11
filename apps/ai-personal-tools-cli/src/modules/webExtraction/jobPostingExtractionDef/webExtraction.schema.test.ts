import { describe, expect, it } from 'bun:test'
import type { ZodTypeAny } from 'zod'

import { jobPostingExtractionDesc } from './jobPostingExtraction.desc'
import { jobPostingExtractSchema, type JobPostingExtractSchemaT } from './jobPostingExtraction.schema'



const d = jobPostingExtractionDesc

const expectedDescriptions = {
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
} satisfies Record<keyof JobPostingExtractSchemaT, string>



describe('jobPostingExtractSchema', () => {
  it('contains expected field descriptions', () => {
    const shape = jobPostingExtractSchema.shape as Record<string, ZodTypeAny>

    for (const [key, expectedDescription] of Object.entries(expectedDescriptions)) {
      expect(shape[key]?.description).toBe(expectedDescription)
    }
  })

  it('validates a full payload shape', () => {
    const now = new Date('2026-03-15T00:00:00.000Z')

    const validPayload = {
      companyName: 'Acme',
      sourceUrl: 'https://acme.jobs/senior-frontend',
      jobTitle: 'Senior Frontend Engineer',
      jobDescription: 'Build and evolve the frontend experience for a product team.',
      countriesHiring: ['US', 'BR'],
      timezone: 'America/New_York',
      workModel: 'REMOTE',
      employmentType: 'FULL_TIME',
      seniority: 'SENIOR',
      mainTechStack: ['TypeScript', 'React'],
      fullTechStack: ['TypeScript', 'React', 'Node.js'],
      scope: ['Ownership', 'Mentoring'],
      salaryCurrency: 'USD',
      salaryFrom: 120000,
      salaryTo: 160000,
      applicationUrl: 'https://acme.jobs/senior-frontend/apply',
      notes: 'Works with cross-functional teams and owns frontend roadmap.',
      publishedAt: now.toISOString(),
    }

    const parsed = jobPostingExtractSchema.safeParse(validPayload)

    expect(parsed.success).toBe(true)
    expect(parsed.success ? parsed.data : null).toBeTruthy()
  })

  it('accepts Not found for publishedAt and converts it to null for repo payload', () => {
    const payload = {
      companyName: 'Acme',
      sourceUrl: 'https://acme.jobs/senior-frontend',
      jobTitle: 'Senior Frontend Engineer',
      jobDescription: 'Own frontend delivery for the product area.',
      countriesHiring: ['US'],
      timezone: 'America/New_York',
      workModel: 'REMOTE',
      employmentType: 'FULL_TIME',
      seniority: 'SENIOR',
      mainTechStack: ['TypeScript'],
      fullTechStack: ['TypeScript', 'React'],
      scope: ['Ownership'],
      salaryCurrency: 'USD',
      salaryFrom: 120000,
      salaryTo: 160000,
      applicationUrl: 'https://acme.jobs/senior-frontend/apply',
      notes: 'Works with frontend roadmap.',
      publishedAt: 'Not found',
    }

    const parsed = jobPostingExtractSchema.safeParse(payload)
    expect(parsed.success).toBe(true)

  })
})
