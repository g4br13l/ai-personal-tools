# Project name

`@repo/infra`

## Project description and objective

`@repo/infra` is a shared infrastructure/utilities workspace package in the `ai-personal-tools` monorepo.
Its objective is to centralize reusable terminal adapters, subprocess stream helpers, branded ok/error results, polling for Firecrawl jobs, Zod description helpers, and other cross-cutting utilities used by workspace packages and apps — without app-specific logic.

## Tech stack

| Category | Technology |
| --- | --- |
| Language | TypeScript |
| Runtime / package manager | Bun `1.3.2` |
| Module system | ESM (`"type": "module"`) |
| Runtime dependencies | `@clack/prompts`, `firecrawl`, `firecrawl-cli`, `picocolors` |
| Dev dependencies | `@repo/tsconfig`, `@repo/core` |
| Lint / typecheck | ESLint (`bunx eslint . --max-warnings 0`), TypeScript (`bunx tsc --noEmit`) |
| Workspace | Bun workspaces (`apps/*`, `packages/*`) |

No file under `packages/infra/src` imports `@repo/core` — `Not found` (devDependency may be reserved for tooling or future use).

## Repository structure

```txt
packages/infra/                                # @repo/infra package root
├── package.json                               # metadata, scripts, exports map (`./all` -> `./src/index.ts`)
├── tsconfig.json                              # extends @repo/tsconfig (see package)
├── barrels.config.json                        # barrelsby: flat barrel under src
└── src/
    ├── index.ts                               # public barrel (generated/maintained via barrelsby)
    ├── clackTerminal.adapter.ts               # terminal UI adapter on @clack/prompts
    ├── adapter/
    │   ├── consoleStream/
    │   │   └── consoleStream.adap.ts          # decode subprocess stdout/stderr streams, optional chunk callbacks
    │   └── logger/
    │       └── logger.adap.ts                 # persist command stdout/stderr/exit code to timestamped log files
    └── shared/
        ├── terminal.ts                        # interactive shell helpers (Windows vs POSIX)
        ├── lib/
        │   ├── firecrawl.utils.ts             # crawl/scrape option types + pollCrawl (consumer supplies Firecrawl client)
        │   └── zodHelper.ts                   # attach descriptions to Zod shapes; ZodDescriptionT
        └── utils/
            ├── async.utils.ts                 # sleep, etc.
            ├── file.utils.ts                  # saveFile, jsonToString, normalizeFilePath, …
            ├── typeTransform.ts               # strToDate and related helpers
            └── brand/
                ├── brandedFns.ts              # makeOkRes, makeErrRes, isOkRes, isErrRes, isResBT, …
                └── BrandedTypes.ts            # branded result types (OkResBT, ErrResBT, …)
```

## Architecture overview

- **Public entrypoint:** `@repo/infra/all` → `./src/index.ts` (barrel).
- **Consumers (observed):** `apps/ai-personal-tools-cli` (job extraction, video transcription flow), `packages/agent` (scraper/crawler tools). `packages/db-ai`: no `@repo/infra` imports — `Not found`.
- **`shared/lib/firecrawl.utils.ts`:** typed options and `pollCrawl`; does not construct a Firecrawl client — the caller passes `fc`.
- **`shared/terminal.ts`:** wraps platform shell behavior (`cmd.exe` on Windows, `bash` on non-Windows) with optional `ComSpec` / `SHELL` fallbacks.
- **`adapter/consoleStream` / `adapter/logger`:** I/O adapters for long-running CLI workflows (stream child output, optional log files on disk).
- **`shared/utils/brand/*`:** lightweight branded success/error results shared across modules (e.g. `makeOkRes` / `makeErrRes` / `isErrRes`).

## Standards and conventions

- ESLint from monorepo root (`eslint.config.mts`); no imports from `@repo/*/src/**` — use `@repo/infra/all`.
- Barrel exports via `barrelsby` (`exports` / `exports-clean` scripts).
- TypeScript strict settings via `@repo/tsconfig` preset in `tsconfig.json`.
- Naming: `*T` suffix for type aliases where enforced; prefer `type` over `interface` per repo ESLint.

## Environment variables

| Variable | Description | Required | Source |
| --- | --- | --- | --- |
| `ComSpec` | Windows shell fallback in `shared/terminal.ts` | No | Process |
| `SHELL` | Non-Windows shell fallback in `shared/terminal.ts` | No | Process |

No package-local `.env` schema. `FIRE_CRAWL_API_KEY` is used when constructing Firecrawl clients in `packages/agent`, not read inside `packages/infra` source — `Not found` in this package.

## Setup and run instructions

### Prerequisites

- Bun `1.3.2` (root `engines.bun` and `packageManager`)

### Install

```sh
bun install
```

### Lint / typecheck

```sh
bun run --filter @repo/infra lint
bun run --filter @repo/infra check-types
```

### Build

No emit/build script in this package — `Not found`.

## Important scripts

| Script | Description |
| --- | --- |
| `lint` | `bunx eslint . --max-warnings 0` |
| `check-types` | `bunx tsc --noEmit` |
| `exports` | Regenerate barrels (`barrelsby` with `barrels.config.json`) |
| `exports-clean` | Remove generated `index.ts` under `src` + regenerate barrels |

## Testing

- Tests under `packages/infra`: `Not found`
- `test` script in `package.json`: `Not found`
- Validation: lint + typecheck; behavior also exercised via `apps/ai-personal-tools-cli` and `packages/agent`.

## Usage examples

```ts
import { zodHelper } from '@repo/infra/all'
import z from 'zod'

const shape = {
  title: z.string(),
  publishedAt: z.string().optional().nullable(),
}

const schema = z.object(
  zodHelper.addDescriptionsToShape(shape, {
    title: 'Job title',
    publishedAt: 'ISO date string or null',
  }),
)
```

```ts
import { strToDate } from '@repo/infra/all'

const publishedAt = strToDate('2026-03-20T10:30:00.000Z')
```

```ts
import { pollCrawl } from '@repo/infra/all'

// fc: Firecrawl client from the consumer (e.g. packages/agent).
await pollCrawl({
  fc,
  jobId: 'crawl-job-id',
  onStatusUpdateFn: ({ status, completed, total }) => {
    console.log(status, completed, total)
  },
})
```

```ts
import { isErrRes, makeOkRes } from '@repo/infra/all'

const res = makeOkRes({ id: 1 }, 'myBrand')
if (!isErrRes(res)) {
  console.log(res.value.id)
}
```

## Contribution guidelines

1. Keep changes limited to reusable infra; avoid app- or feature-specific behavior.
2. Preserve the public surface: add exports only through the barrel and `package.json` `./all` if the export map changes.
3. After edits: `bun run --filter @repo/infra lint` and `bun run --filter @repo/infra check-types`.

## License

`Not found`
