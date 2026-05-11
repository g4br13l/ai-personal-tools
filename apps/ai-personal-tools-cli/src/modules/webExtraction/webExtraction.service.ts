import type { SpinnerResult } from '@clack/prompts'
import { jobPostingRepo } from '@repo/db-ai/all'
import { jobPostingExtractSchema } from './jobPostingExtractionDef/jobPostingExtraction.schema'
import { scraper, crawler } from '@repo/agent/all'
import { strToDate, type CrawlStatusUpdateT } from '@repo/infra/all'
import { JobPostingExtractPrompt } from './jobPostingExtractionDef/jobPostingExtraction.prompt'



export function webExtractionService() {

  
  async function extractPage(url: string, spinner: SpinnerResult) {

    const scraperRes = await scraper().execWithJsonAsync({
      url: url,
      outputSchema: jobPostingExtractSchema,
      prompt: JobPostingExtractPrompt,
      onStatusUpdate: (status, completed, total) => {
        spinner.message(`Scraping [${status}] — ${completed}/${total} completed`)
      },
    })

    return jobPostingRepo().add({
      ...scraperRes,
      publishedAt: strToDate(scraperRes.publishedAt),
    })
  }


  async function extractPageAndSubPages(url: string, spinner: SpinnerResult) {

    const pages = await crawler().execJson({
      url: url,
      outputSchema: jobPostingExtractSchema,
      prompt: JobPostingExtractPrompt,
      onStatusUpdateFn: (
        { status, completed, total, creditsUsed, expiresAt }: CrawlStatusUpdateT,
      ) => {
        spinner.message(
          `Crawling [${status}] — ` +
          `${completed}/${total} pages | ` +
          `credits: ${creditsUsed ?? '—'} | ` +
          `expires: ${expiresAt ?? '—'}`,
        )
      },
    })

    if (pages.length === 0) {
      throw new Error(`Crawl for url ${url} completed but no pages contained valid JSON`)
    }

    const results = await Promise.all(
      pages.map((page) => jobPostingRepo().add({
        ...page,
        publishedAt: strToDate(page.publishedAt),
      })),
    )

    return results
  }

  return { extractPage, extractPageAndSubPages }  
}

