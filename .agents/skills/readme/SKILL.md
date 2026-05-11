---
name: make-or-update-readme-file
description: Generate or update README.md from repository evidence.
---

## Cursor Skill — Generate / Update `README.md`

### Objective
Create or update `README.md` using only evidence from the repository.  
The output must be clear, factual, and useful for both human engineers and LLMs.

### Scope
- Read root and nested project files to infer architecture and workflows.
- Detect if the repository is a single app or a monorepo.
- If monorepo, document each `apps/*` and `packages/*` unit with role and relation.
- Use `readmeTemplateSkill.md` as the section template source.

### Required Analysis
Before writing, inspect:
- root metadata (`package.json`, lock files, README, build/test configs)
- monorepo tooling (workspace config, scripts)
- application/package boundaries (`apps`, `packages`, `services`, `libs`)
- runtime, framework, and test/lint/typecheck config files

Never infer behavior from assumptions. If a field is unknown:
- say `Not found`
- or explicitly state `Assumption: ...` with confidence level

### Required README Sections
Include these sections, in order:
- Project name
- Project description
- Project Objective
- Problem and Solution
- Tech stack
- Folder and File Structure
- Applications (monorepo only)
- Shared Packages (monorepo only)
- Architecture overview
- Standards and conventions
- Environment variables
- Setup and run instructions
- Important scripts
- Testing
- Usage examples (API/CLI/UI as applicable)
- Contribution guidelines
- License

### Quality Rules
- Markdown must be concise, scannable, and action-oriented.
- Prefer specific facts over generic prose.
- Keep section names stable so future updates remain consistent.
- For monorepos, do not flatten all apps/packages into one generic paragraph.
- If a section is genuinely unavailable, keep it but mark it explicitly as missing.

### Delivery Format
- Keep technical language.
- Do not remove existing useful sections unless the repo lacks the information to justify them.

### Reference
- `@.cursor/skills/readme/references/readmeTemplateSkill.md`
