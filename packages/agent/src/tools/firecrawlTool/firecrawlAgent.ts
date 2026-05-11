import { envConfig } from './../../../../../envConfig'
import { Firecrawl } from 'firecrawl'
// import Firecrawl from 'firecrawl'



export const fc = new Firecrawl({ apiKey: envConfig.FIRE_CRAWL_API_KEY })
