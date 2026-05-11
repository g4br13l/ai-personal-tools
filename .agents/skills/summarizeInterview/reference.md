# Summary Reference

## Goal

Produce a concise but information-dense summary for a Senior or Staff Software Engineer interview. The final document should help the user quickly understand:

- what the company and role actually are
- who the interviewer is
- how the process works
- what signals, risks, and next actions matter most

## Output Path Rule

Place the final markdown summary in the same folder as the transcript file.

Apply these filename conversions:

- `C:/path/interview.mp4_speaker_transcript.txt` -> `C:/path/interview_summary.md`
- `C:/path/interview_speaker_transcript.txt` -> `C:/path/interview_summary.md`
- `C:/path/interview.txt` -> `C:/path/interview_summary.md`

## Writing Rules

- Use only small markdown headers such as `###` and `####`.
- Prefer one markdown table per section.
- Use plain text paragraphs only when a table would make the content harder to read.
- Keep each cell short and scannable.
- Write `Not provided` for user-supplied interviewer fields that were not given.
- Write `Not found` for missing transcript or external research facts.
- Do not mix facts with guesses.
- If a detail comes from the transcript, keep it concise and factual.
- If a detail comes from research, include the source in the summary text where relevant.

## Table Conventions

Use this 3-column format for most sections:

```markdown
| Field | Value |
| --- | --- |
| Example field | Example value |
```

Use short lists inside a cell only when needed, for example `Python; Go; AWS; Terraform`.

## Section Guidance

### Interview Metadata

Capture the high-level interview context.

Focus on:

- what transcript file was analyzed
- what kind of interview this appears to be
- whether the interviewer details came from the user or from research

### Company

Summarize the business in a practical way for job evaluation, not as marketing copy.

Focus on:

- what the company does
- what market or product area it operates in
- relevant size, stage, or funding signals
- any context that affects role quality, stability, or growth

### Interviewer

Capture both user-provided contact details and externally verified profile information.

Focus on:

- who the interviewer is
- how they relate to the team or process
- whether they appear to be technical, recruiting, hiring manager, or leadership

### Role

Describe the actual opportunity discussed in the conversation, not a generic role definition.

Focus on:

- level and scope
- team and mission
- primary stack versus broader stack
- ownership, architecture, mentoring, and leadership expectations

### Recruitment Process

Turn the conversation into an operational view of the process.

Focus on:

- current stage
- remaining stages
- expected timeline
- explicit evaluation dimensions

### Senior / Staff Signals

This section matters most for this skill. Capture evidence that indicates the role is truly senior or staff level, or that it may be mislabeled.

Focus on:

- architecture and system design depth
- expected influence across teams
- leadership, mentoring, and stakeholder work
- signals of ambiguity, ownership, and decision-making scope
- concerns, blockers, or mismatch risks

### External Benchmarking

Use only when you can find credible public information that materially helps the user evaluate the role or company.

Focus on:

- salary or rate signals
- common process patterns
- notable public references worth checking later

### Recommended Next Actions

Make this operational and specific.

Focus on:

- what the user should do next
- why that action matters
- what to prepare before the next interaction

### Additional Notes

Use this for leftovers that still help decision-making.

Focus on:

- unresolved questions
- important quotes or phrasing
- short conclusion on the opportunity quality

## Recommended Report Template

```markdown
### Interview Summary

#### Interview Metadata
| Field | Value |
| --- | --- |
| Interview Context | [recruiter screen, hiring manager, technical, panel, or Not found] |

### Company
| Field | Value |
| --- | --- |
| Company Name | [value or Not found] |
| Website | [value or Not found] |
| Industry / Sector | [value or Not found] |
| Company Description | [short practical summary] |
| Product / Service | [value or Not found] |
| Stage / Size / Funding | [value or Not found] |
| Why This Matters | [brief impact on the opportunity] |
| Transcript Notes | [what was said in the interview] |
| External Research | [verified external facts] |

### Interviewer
| Field | Value |
| --- | --- |
| Name | [value or Not provided / Not found] |
| Role / Title | [value or Not provided / Not found] |
| Interview Function | [recruiter, engineer, manager, director, founder, or Not found] |
| LinkedIn | [value or Not provided / Not found] |
| Contact Email | [value or Not provided / Not found] |
| WhatsApp | [value or Not provided] |
| Other Professional Links | [GitHub, company bio, or Not found] |
| Background Notes | [team, tenure, expertise, seniority] |

### Role
| Field | Value |
| --- | --- |
| Role Title | [value or Not found] |
| Seniority Level | [Senior, Staff, Principal, or Not found] |
| Team / Department | [value or Not found] |
| Main Tech Stack | [primary stack expected in the role] |
| Full Tech Stack | [broader stack mentioned or implied] |
| Core Responsibilities | [short summary] |
| Expected Scope | [delivery, architecture, mentoring, leadership, cross-team impact] |
| Work Model | [remote, hybrid, onsite, contractor, full-time, or Not found] |
| Location / Time Zone | [value or Not found] |
| Compensation Signals | [salary, rate, equity, and the currency or Not found] |

### Recruitment Process
| Field | Value |
| --- | --- |
| Stages Mentioned | [ordered list in one cell] |
| Current Stage | [value or Not found] |
| Next Step | [value or Not found] |
| Timeline | [value or Not found] |
| Evaluation Criteria | [coding, system design, leadership, communication, domain knowledge] |
| Process Risks / Unknowns | [unclear timeline, missing steps, vague expectations, or Not found] |

### Senior / Staff Signals
| Field | Value |
| --- | --- |
| Strengths Highlighted | [strong positive signals] |
| Concerns or Risks | [gaps, blockers, weak signals] |
| Architecture Expectations | [system design depth, scale, platform thinking] |
| Leadership Expectations | [mentoring, strategy, stakeholder management] |
| Scope of Influence | [team-level, multi-team, org-level, or Not found] |
| Role-Level Match | [why this seems Senior, Staff, mislabeled, or unclear] |
| Culture / Team Dynamics | [pace, autonomy, collaboration, support] |

### External Benchmarking
| Field | Value |
| --- | --- |
| Comparable Salary Range | [value or Not found] |
| Typical Interview Pattern | [value or Not found] |
| Useful Public References | [links, source names, or Not found] |

### Recommended Next Actions
| Field | Value |
| --- | --- |
| Recommended Action | [what the user should do next] |
| Why | [brief reasoning] |
| Suggested Deadline | [date or timeframe] |
| Preparation Topics | [system design, domain prep, leadership stories, compensation, or Not found] |

### Additional Notes
| Field | Value |
| --- | --- |
| Open Questions | [things still unclear] |
| Important Quotes or Signals | [short quotes or paraphrases] |
| Overall Takeaway | [short conclusion] |
```

## Adaptation Guidance

- Keep the section order unless there is a strong reason to change it.
- Remove a row only when it adds no value and would be repetitive.
- Add rows when the interview includes important details not covered by the default template.
- If a section becomes too dense, keep the table for structured facts and add a short paragraph below it.
