# Project name

`@repo/db-ai`

## Project description and objective

`@repo/db-ai` is the database package in the `ai-personal-tools` monorepo. It provides the Prisma client, typed repository access, and generated Zod schemas for the web extraction features.

Current objective: persist normalized job-posting data in MongoDB and expose a stable package entrypoint (`@repo/db-ai/all`) for app and service layers.

## Tech stack

- **Language:** TypeScript (ESM)
- **Runtime / package manager:** Bun `1.3.2`
- **Database:** MongoDB (via Prisma datasource)
- **ORM / DB client:** Prisma `6.19` + `@prisma/client`
- **Validation schema generation:** `prisma-zod-generator` + Zod `4`
- **Workspace dependencies:** `@repo/core`, `@repo/tsconfig` (dev)
- **Note:** `dotenv` is listed in `package.json` `dependencies` but has no import under `packages/db-ai/src` — `Not found`
- **Lint / typecheck:** ESLint + TypeScript (`tsc --noEmit`)

## Repository structure

```txt
packages/db-ai/
├── src/index.ts                               # Barrel entrypoint exported as @repo/db-ai/all
├── src/prisma.ts                              # Prisma client singleton initialization
├── src/repo/jobPosting.repo.ts                # Repository API for persisting JobPosting entities
├── src/prisma/schema.prisma                   # Prisma schema (MongoDB datasource + model mapping)
├── src/prisma/zod-generator.config.json       # prisma-zod-generator configuration
├── src/prisma/tbZodSchema.ts                  # tbZodSchema aggregate + re-exports from generated prisma-zod
├── src/migrations/run.ts                      # Custom migration runner (ordered script execution)
├── src/migrations/migration.types.ts          # Migration function/type contracts
├── src/migrations/scripts/001_add-job-description.ts # Ordered migration script (register in run.ts)
├── src/data/companyJobPages.json              # Seed-like source list used by workspace job search workflows
├── prisma.config.ts                           # Prisma config at package root (schema path, Prisma migrations path, datasource URL)
├── barrels.config.json                        # Barrelsby configuration for generated exports
├── tsconfig.json                              # Package-level TS config extending shared preset
├── package.json                               # Package metadata and scripts
└── generated/                                 # Generated Prisma client + generated Zod schemas (ignored by git)
```

## Architecture overview

This package sits in the data-access layer and is consumed by app services (for example `apps/ai-personal-tools-cli`) through public exports only.

```txt
app/service layer
  -> @repo/db-ai/all
      -> jobPostingRepo().add()
          -> prisma.jobPosting.create()
              -> MongoDB (job_postings collection)
```

Key architecture decisions found in code:

- Domain input type comes from `@repo/core` (`JobPostingEntityT`) and is persisted by `jobPostingRepo`.
- Prisma schema maps camelCase model fields to snake_case Mongo fields via `@map(...)`.
- Generated artifacts (`generated/client`, `generated/prisma-zod`) are regenerated via `db-gen`, not manually edited.
- Custom Mongo operations live under `src/migrations/scripts/` and are executed in order by `src/migrations/run.ts`. **No `_migrations` ledger collection** is implemented in this repo — `Not found`; keep scripts idempotent where possible and never reorder/remove scripts that have already been applied in shared environments.

## Standards and conventions

- **Layering:** callers should use `@repo/db-ai/all` instead of importing internal source paths.
- **TypeScript conventions:** strict typed APIs with type aliases ending in `T` (enforced by shared ESLint rules).
- **Module format:** ESM (`"type": "module"` in package metadata).
- **Code style:** shared ESLint config (`eslint.config.mts`) with stylistic + TypeScript + import rules.
- **Generated code policy:** `generated/**` is git-ignored and expected to be produced by scripts.
- **Migration convention:** append new migration files under `src/migrations/scripts/` and register them in order in `src/migrations/run.ts`.

## Environment variables

Environment values are loaded from the nearest `.env` by `loadEnvFromRoot()` (`shell/loadEnv.ts`) and validated by root `envConfig.ts`.

| Variable | Required | Used by | Notes |
| --- | --- | --- | --- |
| `ENV` | Yes | `src/prisma.ts` | Controls non-prod Prisma global caching (`dev`, `hml`, `prod`) |
| `DATABASE_URL` | Yes | `prisma.config.ts`, `schema.prisma` | MongoDB connection URL |
| `FIRE_CRAWL_API_KEY` | Yes | `envConfig.ts` validation | Required by current shared env schema |
| `AI_GATEWAY_API_KEY` | Yes | `envConfig.ts` validation | Required by current shared env schema |
| `OPEN_ROUTER_KEY` | Yes | `envConfig.ts` validation | Required by current shared env schema |

## Setup and run instructions

Prerequisites:

- Bun `1.3.2`
- Root `.env` file with required keys
- Reachable MongoDB instance for `DATABASE_URL`

Install dependencies from repository root:

```bash
bun install
```

Generate Prisma client and Zod schemas:

```bash
bun run --filter @repo/db-ai db-gen
```

Sync Prisma schema to database:

```bash
bun run --filter @repo/db-ai db-push
```

Run ordered custom migrations:

```bash
bun run --filter @repo/db-ai db:migrate
```

## Important scripts

From `packages/db-ai/package.json`:

| Script | Command | Purpose |
| --- | --- | --- |
| `db-gen` | `bunx prisma generate` | Generate Prisma client and prisma-zod outputs |
| `db-push` | `bunx --bun prisma db push` | Push Prisma schema changes to the database |
| `db:migrate` | `bun src/migrations/run.ts` | Run ordered custom migration scripts |
| `lint` | `bunx eslint . --max-warnings 0` | Lint package source |
| `check-types` | `bunx tsc --noEmit` | Run TypeScript checks |
| `exports` | `barrelsby --delete --singleQuotes --noSemicolon --c barrels.config.json` | Regenerate barrel exports |
| `exports-clean` | PowerShell remove old `index.ts` + barrelsby | Clean and regenerate barrel exports |

## Testing

- Package test files: Not found
- `test` script in `packages/db-ai/package.json`: Not found
- Suggested validation currently available:
  - `bun run --filter @repo/db-ai lint`
  - `bun run --filter @repo/db-ai check-types`

## Usage examples

Persist a job posting via repository API:

```ts
import { jobPostingRepo } from '@repo/db-ai/all'

await jobPostingRepo().add({
  companyName: 'Acme',
  sourceUrl: 'https://example.com/jobs/123',
  jobTitle: 'Senior Full-Stack Engineer',
  jobDescription: 'Build and evolve product features.',
  countriesHiring: ['BR', 'US'],
  timezone: 'America/Sao_Paulo',
  workModel: 'REMOTE',
  employmentType: 'FULL_TIME',
  seniority: 'SENIOR',
  mainTechStack: ['TypeScript', 'React'],
  fullTechStack: ['TypeScript', 'React', 'Node.js'],
  scope: ['Feature delivery', 'Code review'],
  salaryCurrency: 'USD',
  salaryFrom: 120000,
  salaryTo: 170000,
  notes: 'Remote role',
  applicationUrl: 'https://example.com/jobs/123/apply',
  publishedAt: new Date(),
})
```

Use generated Zod schemas:

```ts
import { tbZodSchema } from '@repo/db-ai/all'

const parsed = tbZodSchema.JobPostingCreateSchema.parse(input)
```

## Contribution guidelines

- Keep package boundaries clean: import this package through `@repo/db-ai/all`.
- After schema edits, regenerate artifacts with `db-gen` and verify with lint/typecheck.
- When adding migrations, create a new sequential file in `src/migrations/scripts/` and import/register it in `src/migrations/run.ts` in order.
- Contribution policy docs (`CONTRIBUTING`, PR template, branching policy): Not found.

## License

License file: Not found
