import z from 'zod'
import { loadEnvFromRoot } from './shell/loadEnv'



loadEnvFromRoot()

const envSchema = z.object({
  ENV: z.enum(['dev', 'hml', 'prod']),
  FIRE_CRAWL_API_KEY: z.string().min(6).max(100),
  AI_GATEWAY_API_KEY: z.string().min(6).max(100),
  OPEN_ROUTER_KEY: z.string().min(6).max(200),
  DATABASE_URL: z.string().min(6).max(300),
  HUGGING_FACE_TOKEN: z.string().min(6).max(100),
  WHISPER_MODEL_PATH: z.string().min(6).max(200),
})
type EnvSchemaT = z.infer<typeof envSchema>

const env = envSchema.parse(process.env)

export const envConfig = {
  ENV: env.ENV,
  FIRE_CRAWL_API_KEY: env.FIRE_CRAWL_API_KEY,
  AI_GATEWAY_API_KEY: env.AI_GATEWAY_API_KEY,
  OPEN_ROUTER_KEY: env.OPEN_ROUTER_KEY,
  DATABASE_URL: env.DATABASE_URL,
  HUGGING_FACE_TOKEN: env.HUGGING_FACE_TOKEN,
  WHISPER_MODEL_PATH: env.WHISPER_MODEL_PATH,
} as const satisfies EnvSchemaT
