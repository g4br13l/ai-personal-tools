import { defineConfig } from 'prisma/config'
import { envConfig } from './../../envConfig'



export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: envConfig.DATABASE_URL,
  },
})
