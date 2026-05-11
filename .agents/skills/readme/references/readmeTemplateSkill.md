---
name: readme-file-template
description: Template for generating a concise, evidence-based README.
---

# README.md — LLM-Optimized Template

> **Instruction for LLMs**  
> Build this README from repository evidence only.  
> Do not invent values, endpoints, scripts, or architecture.  
> If data is missing, write `Not found` or `Assumption: ...`.

## Project Information

### Project Name
### Project Description
### Project Objective

## Problem and Solution


## Repository Type
`Single application` or `Monorepo`

## Tech Stack
* **Language(s)**
* **Runtime / Package Manager**
* **Framework(s)**
* **Frontend**
* **Backend**
* **Database / Storage**
* **Styling / UI**
* **Monorepo / Build Tools**
* **Lint / Format / Typecheck**
* **Testing**

## Folder and File Structure
```txt
repo-root/
├── apps/              # applications (if monorepo)
├── packages/          # shared libraries (if monorepo)
├── scripts/           # tooling
├── env/               # env configs
└── config files
```
Add the one line description on each Folder and File Structure line

## Applications (monorepo only)
Repeat once per app:
* **Description**
* **Framework**
* **Responsibility**
* **Run command**
* **Port** (if any)

### `<app-name>`
```txt
Description: 
Framework:
Responsibility:
Run:
Port:
```

```sh
command-to-run
```

## Shared Packages (monorepo only)
* **`<package-name>`**:

## Architecture Overview
```txt
[ optional architecture sketch ]
```

## Standards and conventions

## Setup and Run

### Prerequisites
* Tool A `x.y.z`
* Tool B `x.y.z`

### Install
```sh
install-command
```

### Development
```sh
dev-command
```

### Build
```sh
build-command
```

### Lint / Format / Type Check
```sh
lint-command
typecheck-command
format-command
```

## Available Scripts
| Script | Description |
| --- | --- |
| `dev` | |
| `build` | |
| `lint` | |
| `test` | |

## Environment Variables
| Variable | Description | Required | Source |
| --- | --- | --- | --- |
| `ENV_NAME` | | Yes/No | |

## Project Standards and Conventions
* Code style:
* Naming conventions:
* Lint/format rules:
* Type system rules:
* Folder ownership:

## Testing
* Test types:
* How to run:

```sh
test-command
```

## Usage Examples
```ts
// minimal usage example
```

## Contribution Guidelines
1. Branching strategy
2. Local validation steps
3. PR expectations

## License
* License:
* If unknown:
  * `Not found`

## Notes for LLMs
* Re-scan repository before each update.
* Keep section order stable.
* Prefer explicitness over inferred interpretation.
