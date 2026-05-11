import type { Firecrawl, ActionOption, FormatOption, ScrapeOptions, WebhookConfig } from 'firecrawl'
import { sleep } from '../utils/async.utils'



export type ScrapeOptionsT = {
  formats?: FormatOption[]
  headers?: Record<string, string>
  includeTags?: string[]
  excludeTags?: string[]
  onlyMainContent?: boolean
  timeout?: number
  waitFor?: number
  mobile?: boolean
  parsers?: Array<string | {
    type: 'pdf'
    mode?: 'fast' | 'auto' | 'ocr'
    maxPages?: number
  }>
  actions?: ActionOption[]
  location?: {
    country?: string
    languages?: string[]
  }
  skipTlsVerification?: boolean
  removeBase64Images?: boolean
  fastMode?: boolean
  useMock?: string
  blockAds?: boolean
  proxy?: 'basic' | 'stealth' | 'enhanced' | 'auto' | string
  maxAge?: number
  minAge?: number
  storeInCache?: boolean
  integration?: string
  origin?: string
}

export type CrawlOptionsT = {
  prompt?: string
  excludePaths?: string[] | null
  includePaths?: string[] | null
  maxDiscoveryDepth?: number | null
  sitemap?: 'skip' | 'include' | 'only'
  ignoreQueryParameters?: boolean
  deduplicateSimilarURLs?: boolean
  limit?: number | null
  crawlEntireDomain?: boolean
  allowExternalLinks?: boolean
  allowSubdomains?: boolean
  delay?: number | null
  maxConcurrency?: number | null
  webhook?: string | WebhookConfig | null
  scrapeOptions?: ScrapeOptions | null
  regexOnFullURL?: boolean
  zeroDataRetention?: boolean
  integration?: string
  origin?: string
}



export type FcUrlT = { url: string }
export type ExecPropsT = FcUrlT & ScrapeOptionsT


export type CrawlStatusUpdateT = {
  status: 'scraping' | 'completed' | 'failed' | 'cancelled'
  completed: number
  total: number
  creditsUsed?: number
  expiresAt?: string
}

export type CrawlStatusUpdateFnT = (status: CrawlStatusUpdateT) => void


export type PollCrawlPropsT = {
  fc: Firecrawl
  jobId: string
  onStatusUpdateFn: CrawlStatusUpdateFnT
  timeoutSec?: number
  intervalSec?: number
}


export const pollCrawl = async ({
  fc,
  jobId,
  onStatusUpdateFn,
  timeoutSec = 10_800, // 3h
  intervalSec = 2_000,
}: PollCrawlPropsT) => {

  const maxAttempts = timeoutSec / intervalSec

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {

    const job = await fc.getCrawlStatus(jobId)

    onStatusUpdateFn({
      status: job.status,
      completed: job.completed,
      total: job.total,
      creditsUsed: job.creditsUsed,
      expiresAt: job.expiresAt,
    })

    if (job.status === 'completed' || job.status === 'failed') {
      return job
    }

    await sleep(intervalSec * 1_000)
  }

  throw new Error(`Timed out waiting for crawl job ${jobId} after ${timeoutSec} seconds`)
}
