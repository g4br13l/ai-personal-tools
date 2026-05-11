import type { JobPostingShape } from '@repo/core/all'
import type { ZodDescriptionT } from '@repo/infra/all'



type JobPostingShapeT = typeof JobPostingShape
type FieldsDescT = { [K in keyof ZodDescriptionT<JobPostingShapeT>]: string }


export const jobPostingExtractionDesc = {
  companyName: 'Exact official company name',
  sourceUrl: 'Full canonical URL of the page where the role details were extracted',
  jobTitle: 'Exact title text of the open role as published',
  jobDescription:
    'A concise but comprehensive summary of the role covering: ' +
    'purpose of the position, key responsibilities, team context, ' +
    'required qualifications, and any standout perks or constraints. ' +
    'Preserve specifics (team size, product domain, growth stage) ' +
    'and omit generic boilerplate. 3-6 sentences.',
  countriesHiring:
    'Array-like list of countries/regions explicitly mentioned as eligible hiring locations',
  timezone: 
    'IANA timezone identifier for the role coverage region ' +
    '(e.g. "America/New_York"), "Multiple" when several apply, or "Not found"',
  workModel: 'One of: "remote", "hybrid", "onsite", "flexible", or "Not found"',
  employmentType:
    'One of: "full-time", "contract", "part-time", "B2B", "PJ", "CLT", or "Not found"',
  seniority:
    'One of: "Junior", "Mid Level", "Senior", "Staff / specialist", "Principal", or "Not found"',
  mainTechStack: 
    'Core technologies and platforms that are central for this role ' +
    '(e.g. TypeScript, React, Node.js, AWS)',
  fullTechStack: 'All technologies and tools explicitly mentioned in the posting',
  scope: 
    'Evidence of ownership scope such as architecture, mentoring, roadmap ownership, ' +
    'incident ownership',
  salaryCurrency: 
    'Currency code used by the offered compensation. ' +
    'Infer currency using these signals in order: ' +
    '1) explicit currency code or symbol near the salary text (USD, EUR, BRL, R$, $, €, £, ...). ' +
    '2) salary cadence + locale clues in the role page (hourly / monthly / yearly), ' +
    'page language, URL locale, and policy/compensation context. ' +
    '3) location/context hints from company location, timezone, hiring countries, ' +
    'footer/legal block, or salary policy page. ' +
    'If currency cannot be inferred confidently, use "Not found". ',
  salaryFrom: 'Minimum published compensation value or 0 if not found.',
  salaryTo:
    'Maximum published compensation value 0 if not found. ' +
    'Parse numeric values only. ' +
    'If only one bound is present, set from and to to that same number. ' +
    'If only a single flat value exists and no clear bound exists, still use both fields. ',
  notes: 'Short evidence snippets backing work model, seniority, and scope decisions',
  applicationUrl: 'Direct role application URL from the listing, or "Not found" if unavailable',
  publishedAt:
    'Publication date for this posting as an ISO datetime string, or "Not found" ' +
    'if unavailable on the page',
} satisfies FieldsDescT
