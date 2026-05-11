# @repo/tsconfig

## Project name

`@repo/tsconfig`

## Project description and objective

`@repo/tsconfig` is a shared TypeScript configuration package for **AI Personal Tools** (`ai-personal-tools`): a collection of AI-powered tools designed to automate repetitive tasks and boost productivity.  
Its goal is to provide reusable base and framework-specific TypeScript presets so apps and other packages keep consistent compiler behavior.

## Tech stack

| Category | Technology |
| --- | --- |
| Language | TypeScript `^5.9` |
| Runtime / Package Manager | Bun `1.3.2` |
| Build / Tooling | Bun scripts + `bunx` |
| Lint / Type Check | ESLint (`bunx eslint`) and TypeScript (`bunx tsc --noEmit`) |
| Config targets | Bun/Hono apps, React apps, React libraries |

## Repository structure

```txt
packages/                                   # workspace for shared project packages
└── typescript/                             # shared TypeScript preset package
    ├── package.json                        # package metadata, scripts, exports map
    └── src/                                # TypeScript preset catalog
        ├── tsConfigBase.json               # shared compiler defaults across all presets
        ├── tsConfigBunHono.json            # Bun + Hono strict profile
        ├── tsConfigReactApp.json            # React application profile
        └── tsConfigReactLibrary.json        # React library profile
```

## Preset map

| Preset | File | Intended use |
| --- | --- | --- |
| `tsConfigBunHono` | `src/tsConfigBunHono.json` | Bun services and Hono apps |
| `tsConfigReactApp` | `src/tsConfigReactApp.json` | React applications in the monorepo |
| `tsConfigReactLib` | `src/tsConfigReactLibrary.json` | Shared UI or utility libraries in React |
| `tsConfigBase` | `src/tsConfigBase.json` | Internal base settings consumed by other presets |

## Architecture overview

- Monorepo shared package with an exports-only surface for reusable TypeScript presets.
- Consumers import preset paths from package exports, for example:
  `@repo/tsconfig/tsConfigReactApp`.
- No runtime code execution path; compile-time configuration only.
- Downstream validation occurs through app or package-level typecheck pipelines, not
  unit test execution inside this package.

## Standards and conventions

- `single quotes` and no trailing semicolons in TS/JS code in the repo
- one responsible file per preset: each file has a clear domain and target profile
- boundary-first dependency direction: package consumers import presets, this package
  does not import from app code
- small, composable configuration fragments with explicit extension points
- Type precision at integration boundaries where configs are consumed by downstream
  packages

## Environment variables

| Variable | Description | Required | Source |
| --- | --- | --- | --- |
| `Not found` | Not found | No | Not found |

## Setup and run instructions

### Prerequisites

- Bun `1.3.2` (used across the monorepo)

### Install

```sh
bun install
```

### Development

No long-running dev command is defined for this package.

### Build

No build command is defined for this package.

### Lint / Format / Type Check

```sh
cd packages/typescript
bun run lint
bun run check-types
```

## Important scripts

| Script | Description |
| --- | --- |
| `lint` | Runs `bunx eslint . --max-warnings 0` |
| `check-types` | Runs `bunx tsc --noEmit` |

## Testing

- Test suite: `Not found`
- Test command: `Not found`
- This package is configuration-only and is validated through consumers’ `check-types`
  commands in CI/local workflows.

## Usage examples

```json
{
  "extends": "@repo/tsconfig/tsConfigReactApp"
}
```

```json
{
  "extends": "@repo/tsconfig/tsConfigReactLib"
}
```

```json
{
  "extends": "@repo/tsconfig/tsConfigBunHono"
}
```

## Contribution guidelines

1. Make minimal, reviewable changes limited to configuration intent.
2. Keep exports and file paths explicit to avoid breakages for downstream packages.
3. Run `bun run lint` and `bun run check-types` before submitting changes.

## License

`Not found`
