# Project name

`@repo/agent`

## Project description and objective

`@repo/agent` is a workspace library that wraps Firecrawl scraping/crawling operations and returns typed, Zod-validated payloads.

Current objective: provide reusable extraction primitives for monorepo apps (for example `apps/ai-personal-tools-cli`) so extraction orchestration stays centralized in one package.

## Tech stack

- **Language:** TypeScript (ESM)
- **Runtime / package manager:** Bun `1.3.2` (workspace standard)
- **Extraction SDKs:** `firecrawl`, `firecrawl-cli`
- **Validation:** `zod` — imported by `scraper.ts` / `crawler.ts` (`dependencies` in `package.json`)
- **Terminal / UI libs (declared):** `@clack/prompts`, `picocolors` — **not** imported under `packages/agent/src` — `Not found`
- **Workspace packages:** `@repo/infra` (`dependencies` — runtime imports from `scraper.ts` / `crawler.ts`), `@repo/core` (`devDependencies` — no import under `packages/agent/src` — `Not found`), `@repo/tsconfig` (`devDependencies`)
- **Tooling:** ESLint, TypeScript (`tsc --noEmit`), Barrelsby

## Repository structure

```txt
packages/agent/
├── src/index.ts                              # Public barrel exports for this package
├── src/agent.ts                              # Agent stub (currently commented out / not active)
├── src/tools/firecrawlTool/firecrawlAgent.ts # Shared Firecrawl client instance (`fc`)
├── src/tools/scraper/scraper.ts              # Batch scrape wrappers + optional JSON extraction with Zod parsing
├── src/tools/crawler/crawler.ts              # Crawl wrappers + JSON extraction for crawled pages
├── barrels.config.json                        # Barrelsby generation config
├── tsconfig.json                              # Package TypeScript config (extends `@repo/tsconfig`)
└── package.json                               # Package metadata, scripts, dependencies, and exports
```

## Architecture overview

`Consumer app/service` -> `@repo/agent` (`scraper()` / `crawler()`) -> `Firecrawl API` -> polling/status helpers from `@repo/infra` -> Zod parse -> typed payload returned to caller.

Key behaviors from implementation:

- `scraper().execAsync(...)` runs batch scrape for one URL and returns first document.
- `scraper().execWithJsonAsync(...)` requests Firecrawl JSON format and validates with provided Zod schema.
- `crawler().execJson(...)` starts crawl, polls status, parses each document JSON with provided Zod schema, and returns typed array.
- Extracted responses are persisted to `.firecrawl` output files via `@repo/infra` file helpers.
- Public entrypoint is `@repo/agent/all` (mapped to `./src/index.ts` in `exports`).

## Standards and conventions

- Use public package entrypoints (for example `@repo/agent/all`), not internal `src/**` imports.
- Keep extraction contracts schema-first: always pass `outputSchema` and parse returned JSON through Zod.
- Maintain script discipline: lint and typecheck must pass with zero lint warnings.
- Barrel exports are generated via Barrelsby (`exports` / `exports-clean` scripts).
- Type naming conventions follow workspace ESLint rules (type aliases generally suffixed with `T`).

## Environment variables

Environment variables are loaded from the nearest `.env` while walking up from `cwd` (`loadEnvFromRoot()` in `shell/loadEnv.ts`) and validated by root `envConfig.ts`.

| Variable | Required | Used by this package | Source |
| --- | --- | --- | --- |
| `ENV` | Yes | Indirect (required by root `envConfig` parse) | Root `.env` |
| `FIRE_CRAWL_API_KEY` | Yes | Firecrawl client auth in scraper/crawler | Root `.env` |
| `AI_GATEWAY_API_KEY` | Yes | Indirect (required by root `envConfig` parse) | Root `.env` |
| `OPEN_ROUTER_KEY` | Yes | Indirect (required by root `envConfig` parse) | Root `.env` |
| `DATABASE_URL` | Yes | Indirect (required by root `envConfig` parse) | Root `.env` |

## Setup and run instructions

Prerequisites:

- Bun `1.3.2`
- Root `.env` with required variables

Install dependencies from repository root:

```bash
bun install
```

This package is a library (no standalone `dev` or `start` script found). Use package scripts from the workspace root:

```bash
bun run --filter @repo/agent lint
bun run --filter @repo/agent check-types
```

## Important scripts

From `packages/agent/package.json`:

| Script | Command | Purpose |
| --- | --- | --- |
| `lint` | `bunx eslint . --max-warnings 0` | Lint package source |
| `check-types` | `bunx tsc --noEmit` | Typecheck package source |
| `exports` | `barrelsby --delete --singleQuotes --noSemicolon --c barrels.config.json` | Generate barrel export files |
| `exports-clean` | PowerShell remove `index.ts` files + run `barrelsby` | Regenerate clean barrel exports |

## Testing

- Test files in `packages/agent`: `Not found`
- `test` script in `packages/agent/package.json`: `Not found`
- Assumption (medium confidence): run workspace tests at app/package level where this package is consumed.

## Usage examples

Scrape one page and parse JSON payload:

```ts
import z from 'zod'
import { scraper } from '@repo/agent/all'

const schema = z.object({
  title: z.string(),
  company: z.string(),
})

const data = await scraper().execWithJsonAsync({
  url: 'https://example.com/job-posting',
  outputSchema: schema,
  prompt: 'Extract title and company as JSON.',
  onStatusUpdate: (status, completed, total) => {
    console.log(status, completed, total)
  },
})
```

Crawl a URL and parse JSON payload from crawled pages:

```ts
import z from 'zod'
import { crawler } from '@repo/agent/all'

const schema = z.object({
  title: z.string(),
})

const pages = await crawler().execJson({
  url: 'https://example.com/jobs',
  outputSchema: schema,
  prompt: 'Extract the page title as JSON.',
  onStatusUpdateFn: ({ status, completed, total }) => {
    console.log(status, completed, total)
  },
})
```

## Contribution guidelines

- Branching strategy: `Not found`
- PR template: `Not found`
- CONTRIBUTING guide: `Not found`
- Recommended local validation before PR (Assumption: medium confidence):
  - `bun run --filter @repo/agent lint`
  - `bun run --filter @repo/agent check-types`

## License

`Not found`
