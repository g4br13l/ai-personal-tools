# Search Reference

## CV-Derived Matching Baseline

Start from the current CV, then refine with the user's latest instructions.

Default baseline from `docs/CVs/CV-Gabriel-Lima-Senior-FullStack-Engineer-01-2026.md`:

- Senior or Staff-level scope
- Frontend-first full-stack roles
- Strong stack fit: TypeScript, JavaScript, React, Next.js, Node.js, AWS
- Strong supporting signals: micro-frontends, monorepos, testing strategy, performance, system design, AI agents, clean architecture
- Preferred work model: remote-friendly roles compatible with Brazil

## Search Keywords

Use these clusters when filtering or searching:

- Seniority: `senior`, `specialist`, `staff`, `lead`
- Role titles: `software engineer`, `full-stack engineer`, `frontend engineer`, `front-end engineer`, `web engineer`
- Stack: `TypeScript`, `JavaScript`, `React`, `Next.js`, `Node.js`
- Work model: `remote`, `Brazil`, `LATAM`, `Americas`

## Extraction Fields

Capture these fields for each role when available:

| Field | Notes |
| --- | --- |
| Company | Hiring company name |
| Source URL | URL actually checked |
| Job Title | Exact listing title |
| Work Model | Remote, hybrid, onsite, or `Not found` |
| Location | Explicit geography or timezone constraints |
| Employment Type | Full-time, contract, B2B, or `Not found` |
| Seniority | Senior, Staff, Lead, Principal, or `Not found` |
| Stack Signals | Matching and non-matching technologies |
| Scope Signals | Architecture, platform, mentoring, ownership |
| Compensation | Salary/rate/equity if published |
| Application URL | Direct apply link |
| Notes | Short evidence snippets only |

## Scoring Rubric

Score each role out of 20.

| Dimension | Score | Guidance |
| --- | --- | --- |
| Title and seniority fit | 0-5 | Strong fit for Senior/Staff frontend or full-stack |
| Stack fit | 0-5 | Match on TypeScript, React, Next.js, Node.js, AWS, testing |
| Scope fit | 0-5 | Architecture, ownership, mentoring, cross-team influence |
| Work model and location fit | 0-5 | Fully remote and compatible with Brazil or international remote |

Optional bonus:

- `+1` for AI, agentic systems, or modern platform tooling
- `+1` for domains already present in the CV, such as fintech, insuretech, retail, eCommerce, edtech, or crowdfunding

Hard rejections:

- junior or mid-only role
- non-software role
- onsite-only role outside feasible geography
- stack centered on an unrelated ecosystem with weak transferability

## Report Template

Save the final result as markdown and keep it compact.

```markdown
### Job Search Summary

#### Search Inputs
| Field | Value |
| --- | --- |
| CV | `docs/CVs/CV-Gabriel-Lima-Senior-FullStack-Engineer-01-2026.md` |
| Sources Checked | [list of career pages or files] |
| Search Scope | [company pages only or expanded search] |

#### Candidate Profile Snapshot
| Field | Value |
| --- | --- |
| Target Roles | [Senior Frontend / Full-Stack / Staff] |
| Core Stack | [TypeScript; React; Next.js; Node.js; AWS] |
| Preferred Work Model | [Remote; Brazil-compatible] |
| Strong Differentiators | [micro-frontends; testing; AI agents; system design] |

#### Top Matches
| Rank | Score | Company | Role | Work Model | Why It Matches | Apply URL |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 18/20 | [company] | [role] | [remote] | [short reason] | [url] |

#### Detailed Role Notes
##### [Company] - [Role]
| Field | Value |
| --- | --- |
| Score | [x/20 (+ bonuses if used)] |
| Source URL | [url] |
| Seniority Fit | [evidence] |
| Stack Fit | [evidence] |
| Scope Fit | [evidence] |
| Work Model Fit | [evidence] |
| Compensation | [value or Not found] |
| Risks | [short mismatch notes] |
| Recommendation | [apply now / monitor / skip] |

#### Rejected or Low-Fit Roles
| Company | Role | Reason |
| --- | --- | --- |
| [company] | [role] | [onsite only / stack mismatch / junior] |

#### Next Actions
| Priority | Action | Why |
| --- | --- | --- |
| High | [apply or tailor CV] | [brief reason] |
```

## Execution Notes

- Prefer direct filtered job URLs from `src/data/companyJobPages.json`.
- Quote URLs in shell commands because many career pages include query parameters.
- If a page contains many roles, filter aggressively before summarizing.
- If search results already include scraped content, do not scrape the same URLs again.
- Use `Not found` instead of guessing.
