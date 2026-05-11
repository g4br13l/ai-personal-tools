import Firecrawl, { type BatchScrapeJob, type Document, type ScrapeOptions } from 'firecrawl'
import z from 'zod'
import { envConfig } from '../../../../../envConfig'
import { jsonToString, saveFile, sleep, type ExecPropsT, type FcUrlT, type ScrapeOptionsT } from '@repo/infra/all'



type ExecAsyncPropsT = ExecPropsT & {
  pollIntervalMs?: number
  onStatusUpdate?: (status: BatchScrapeJob['status'], completed: number, total: number) => void
}

type ExecWithPropsT<TSchema extends z.ZodType> = FcUrlT & Omit<Partial<ScrapeOptionsT>, 'formats'> & {
  outputSchema: TSchema
  prompt: string
}

type ExecWithJsonAsyncPropsT<TSchema extends z.ZodType> = ExecWithPropsT<TSchema> & {
  pollIntervalMs?: number
  onStatusUpdate?: ExecAsyncPropsT['onStatusUpdate']
}

type ScrapResT = { json?: unknown }

type JsonPayloadT<TSchema extends z.ZodType> = z.output<TSchema>



export function scraper() {

  const fc = new Firecrawl({ apiKey: envConfig.FIRE_CRAWL_API_KEY })


  const saveExtractedRes = async (res: ScrapResT) => {
    await saveFile(
      { content: jsonToString(res), dir: '.firecrawl', fileName: 'scraper' },
    )
    await saveFile(
      { content: jsonToString(res?.json as object), dir: '.firecrawl', fileName: 'scraper-struct' },
    )
  }


  // async function exec({ url, ...props }: ExecPropsT) {

  //   const scrapeRes = await fc.scrape(url, { ...props })
  //   await saveExtractedRes(scrapeRes)
  //   return scrapeRes
  // }


  async function execAsync({
    url,
    pollIntervalMs = 2_000,
    onStatusUpdate,
    ...props
  }: ExecAsyncPropsT): Promise<Document> {

    const { id } = await fc.startBatchScrape([url], { options: { ...props } })

    let job: BatchScrapeJob
    do {
      await sleep(pollIntervalMs)
      job = await fc.getBatchScrapeStatus(id)
      onStatusUpdate?.(job.status, job.completed, job.total)
    } while (job.status === 'scraping')

    if (job.status !== 'completed') {
      throw new Error(`Scrape job ${id} ended with status: ${job.status}`)
    }

    const doc = job.data[0]
    if (!doc) throw new Error(`Scrape job ${id} completed but returned no data`)

    await saveExtractedRes(doc)
    return doc
  }


  // async function execWithJson<TSchema extends z.ZodType>({
  //   url,
  //   outputSchema,
  //   prompt,
  //   ...props
  // }: ExecWithPropsT<TSchema>): Promise<JsonPayloadT<TSchema>> {
  //   const scraperConfig: { url: string } & ScrapeOptions = {
  //     url: url,
  //     formats: [{
  //       type: 'json',
  //       schema: z.toJSONSchema(outputSchema),
  //       prompt: prompt,
  //     }],
  //     ...props,
  //     parsers: [],
  //   }
  //   const res = await exec(scraperConfig)
  //   const jsonPayload = res.json
  //   if (jsonPayload === undefined) {
  //     throw new Error(`Scrape for url ${url} completed without json payload`)
  //   }
  //   return outputSchema.parse(jsonPayload)
  // }


  async function execWithJsonAsync<TSchema extends z.ZodType>({
    url,
    outputSchema,
    prompt,
    pollIntervalMs,
    onStatusUpdate,
    ...props
  }: ExecWithJsonAsyncPropsT<TSchema>): Promise<JsonPayloadT<TSchema>> {

    const scrapeOptions: ScrapeOptions = {
      formats: [{
        prompt: prompt,
        schema: z.toJSONSchema(outputSchema),
        type: 'json',
      }],
      ...props,
      parsers: [],
    }
    const res = await execAsync({ url, pollIntervalMs, onStatusUpdate, ...scrapeOptions })
    if (res.json === undefined) {
      throw new Error(`Batch scrape for url ${url} completed without json payload`)
    }
    return outputSchema.parse(res.json)
  }


  return { execAsync, execWithJsonAsync }
}
