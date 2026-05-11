---
name: search-job-in-companies-pages
description: Search company career pages and job sources for roles that match Gabriel Lima's CV, using the local Firecrawl skills for search, scrape, map, and browser escalation. Use when the user asks to find matching jobs, scan company career pages, evaluate openings against the CV in docs/CVs/CV-Gabriel-Lima-Senior-FullStack-Engineer-01-2026.md, or review sources from src/data/companyJobPages.json.
---

# Search Job In Companies Pages

## Purpose

Use this skill to find live openings that match the candidate profile in `docs/CVs/CV-Gabriel-Lima-Senior-FullStack-Engineer-01-2026.md`.

Default target profile:

- Senior or Staff software engineer
- Frontend-specialist or full-stack
- TypeScript, React, Next.js, Node.js, AWS
- Remote-friendly, with Brazil or international remote compatibility

## Required Local Inputs

- Candidate profile: `docs/CVs/CV-Gabriel-Lima-Senior-FullStack-Engineer-01-2026.md`
- Company career pages: `src/data/companyJobPages.json`

Read the candidate CV first on every run. Do not rely on memory.

## Mandatory Firecrawl Composition

Before doing web work, read these local skill files:

- `../firecrawl/SKILL.md`
- `../firecrawl-search/SKILL.md`
- `../firecrawl-map/SKILL.md`
- `../firecrawl-scrape/SKILL.md`
- `../firecrawl-browser/SKILL.md`

Rules:

- Use the local Firecrawl skills instead of built-in web search or fetch tools for external sites.
- Start with the cheapest valid step: `scrape` for known URLs, `map` for site discovery, `search` when no URL is known, `browser` only when interaction is required.
- Save raw outputs under `.firecrawl/`.
- Reuse existing `.firecrawl/` outputs when they already contain the needed data.

## Workflow

1. Read the CV and extract the target role, seniority, stack, location constraints, and notable strengths.
2. Read `src/data/companyJobPages.json`. Prefer `filters[].url` over `careers_page` when filters exist.
3. For each company source:
   - Use `scrape` for direct filtered job URLs or known listing pages.
   - Use `map` when the company page is broad and the actual jobs page must be located.
   - Use `search` only to expand the search beyond the local source list or when the career URL is unknown.
   - Use `browser` only if the listing cannot be extracted through `scrape`.
4. Extract each viable role with the fields from [reference.md](reference.md).
5. Score each role using the rubric in [reference.md](reference.md).
6. Return the best matches first and clearly explain rejections or low-fit roles.
7. Save the final report to `docs/job-search/<YYYY-MM-DD>-job-matches.md` unless the user asks for another path.

## Decision Rules

- Reject junior, mid-level, or clearly non-matching roles unless the user explicitly asks for broader coverage.
- Penalize roles that are onsite-only or restricted to locations incompatible with Brazil-based remote work.
- Favor roles that include frontend architecture, platform ownership, full-stack delivery, testing, performance, or technical leadership.
- Treat explicit TypeScript, React, Next.js, Node.js, AWS, micro-frontends, testing, and AI-agent keywords as strong positives.
- Do not invent compensation, visa support, work model, or remote eligibility. Use `Not found` when missing.

## Output

Use the report structure in [reference.md](reference.md).

Always include:

- search scope and sources checked
- candidate-profile summary derived from the CV
- top matches ranked by score
- evidence for each score
- low-fit or rejected roles with a short reason
- next actions for the highest-signal opportunities

## Examples

- "Find matching jobs from the companies in `src/data/companyJobPages.json`."
- "Search these company career pages and rank the best openings for Gabriel Lima."
- "Use my CV to find senior remote React or full-stack roles on these companies' job pages."
