import z from 'zod'
import { fc } from '../firecrawlTool/firecrawlAgent'
import { pollCrawl, type CrawlOptionsT, type CrawlStatusUpdateFnT, type ScrapeOptionsT } from '@repo/infra/all'



type CrawlScrapeOptionsT = Omit<Partial<ScrapeOptionsT>, 'formats'>

export type FcCrawlerExecJsonPropsT<
  TSchema extends z.ZodType,
> = {
  url: string
  outputSchema: TSchema
  prompt: string
  onStatusUpdateFn: CrawlStatusUpdateFnT
  crawlOptions?: Partial<CrawlOptionsT>
  scrapeOptions?: CrawlScrapeOptionsT
}


export function crawler() {


  async function execJson<TSchema extends z.ZodType>({
    url,
    outputSchema,
    prompt,
    onStatusUpdateFn,
    crawlOptions = {},
    scrapeOptions = {},
  }: FcCrawlerExecJsonPropsT<TSchema>) {

    const { id: jobId } = await fc.startCrawl(url, {
      ...crawlOptions,
      limit: crawlOptions.limit ?? 10,
      scrapeOptions: {
        formats: [{
          prompt,
          schema: z.toJSONSchema(outputSchema),
          type: 'json',
        }],
        ...scrapeOptions,
        parsers: [],
      },
    })

    const job = await pollCrawl({ fc, jobId, onStatusUpdateFn })

    if (job.status === 'failed') {
      throw new Error(`Crawl job ${jobId} failed`)
    }

    return job.data
      .filter((doc) => doc.json !== undefined)
      .map((doc) => outputSchema.parse(doc.json) as z.output<TSchema>)
  }

  return { execJson }
}
