# Project name

`@repo/core`

## Project description and objective

`@repo/core` is the shared domain package for job posting entities in **AI Personal Tools** (`ai-personal-tools`): a collection of AI-powered tools designed to automate repetitive tasks and boost productivity.  
Its objective is to centralize canonical Zod shapes, enums, and inferred TypeScript types so apps/packages validate and consume the same contract (`@repo/core/all`).

## Tech stack

- Language: TypeScript
- Runtime and package manager: Bun (`bun@1.3.2` in the repo)
- Validation and schema modeling: `zod`
- Module format: ESM (`"type": "module"`)
- Typecheck: TypeScript compiler (`bunx tsc --noEmit`)
- Lint: ESLint (`bunx eslint . --max-warnings 0`)
- Export generation: `barrelsby`

## Repository structure

```txt
ai-personal-tools/
├── packages/
│   ├── core/                         # this package: shared domain schemas/types
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   │   └── jobPosting.entity.ts  # JobPosting schema, enums, inferred types
│   │   │   └── index.ts              # public barrel export target
│   │   ├── barrels.config.json       # barrelsby config for export generation
│   │   ├── tsconfig.json             # package TypeScript config
│   │   └── package.json              # scripts, dependencies, exports
│   ├── agent/                        # workspace package (consumer/dependency peer)
│   ├── db-ai/                        # workspace package (consumer/dependency peer)
│   ├── infra/                        # workspace package (consumer/dependency peer)
│   └── ts/                           # shared TS config package
└── apps/
    └── ai-personal-tools-cli/              # app that imports JobPosting shape from @repo/core/all
```

## Architecture overview

`@repo/core` exposes domain contracts through one public entrypoint (`./all` -> `./src/index.ts`).

High-level flow:

```txt
@repo/core/domain schema (Zod + inferred types)
  -> exported via @repo/core/all
  -> consumed by app/service layers (for example ai-personal-tools-cli and db-ai)
```

Current domain scope in this package:

- Job posting shape (`JobPostingShape`, `JobPostingSchema`, `JobPostingEntityT`)
- Enumerations and type aliases (`WorkModel`, `EmploymentType`, `Seniority`)

## Standards and conventions

- Public imports should use package entrypoints (for example `@repo/core/all`), not `packages/*/src/**`.
- Type aliases follow the `T` suffix convention (for example `JobPostingEntityT`), enforced by shared ESLint rules.
- Type definitions prefer `type` over `interface` (repo ESLint rule).
- Keep domain contracts framework-agnostic and reusable across apps/packages.
- Exports are generated/maintained with `barrelsby` (`exports` and `exports-clean` scripts).

## Environment variables

No environment variables are defined in `packages/core`.  
`Not found`.

## Setup and run instructions

Prerequisites:

- Bun `1.3.2` (repo engine requirement)

Install dependencies at repository root:

```bash
bun install
```

Run package checks from repository root:

```bash
bun run --filter @repo/core lint
bun run --filter @repo/core check-types
```

Regenerate public exports when needed:

```bash
bun run --filter @repo/core exports
```

## Important scripts

Defined in `packages/core/package.json`:

- `lint`: run ESLint with zero warnings threshold
- `check-types`: run TypeScript typecheck without emitting files
- `exports`: regenerate barrel exports via `barrelsby`
- `exports-clean`: remove existing `index.ts` files under `src` and regenerate barrels

## Testing

`packages/core` does not define a local `test` script.  
`Not found`.

Related: `apps/ai-personal-tools-cli` tests job extraction Zod metadata in `jobPostingExtract.schema.test.ts`; field names align with `@repo/core` job posting shape — keep both in sync when editing domain or extraction.

## Usage examples

```ts
import { JobPostingSchema, WorkModel } from '@repo/core/all'

const payload = {
  companyName: 'Acme',
  sourceUrl: 'https://acme.jobs/role',
  jobTitle: 'Senior Full Stack Engineer',
  jobDescription: 'Build product features.',
  countriesHiring: ['BR', 'US'],
  timezone: 'America/Sao_Paulo',
  workModel: WorkModel.enum.REMOTE,
  employmentType: 'FULL_TIME',
  seniority: 'SENIOR',
  mainTechStack: ['TypeScript'],
  fullTechStack: ['TypeScript', 'React', 'Node.js'],
  scope: ['Ownership'],
  salaryCurrency: 'USD',
  salaryFrom: 100000,
  salaryTo: 150000,
  notes: 'Not found',
  applicationUrl: 'https://acme.jobs/role/apply',
  publishedAt: null,
}

const parsed = JobPostingSchema.parse(payload)
```

## Contribution guidelines

- Keep domain changes backward-compatible when possible; schema changes can impact all consumers.
- Validate changes locally before PR:
  - `bun run --filter @repo/core lint`
  - `bun run --filter @repo/core check-types`
- If changing contract fields/enums, update downstream consumers/tests in apps/packages that import `@repo/core/all`.
- Assumption (medium confidence): follow the repository PR workflow used by the monorepo maintainers. No explicit branching strategy document found in this package.

## License

`Not found` in `packages/core/package.json` and repository root metadata.
