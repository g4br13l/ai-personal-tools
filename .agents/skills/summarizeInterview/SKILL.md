---
name: summarize-interview
description: Summarize a full job interview transcript for Senior or Staff Software Engineer roles, enrich it with verified company and interviewer research, and write a markdown report beside the transcript. Use when the user provides an interview transcript file or asks to summarize an interview they participated in.
---

# Summarize Interview

## Purpose

Use this skill to turn a complete interview transcript into a structured, actionable markdown summary for Senior and Staff Software Engineer opportunities.

## First Step: Collect Inputs

Always start by asking for these interviewer fields:

- Name
- Email
- LinkedIn
- WhatsApp
- Role / Rule

Also ask for the full transcript file path.

Rules:

- Ask for all five interviewer fields every time, even if the user may only know some of them.
- Treat all interviewer fields as optional. Record missing values as `Not provided`.
- Do not continue until the user provides a readable transcript file path.
- Prefer a full transcript file over pasted excerpts.
- Prefer a speaker-labeled transcript such as `*_speaker_transcript.txt` when available.

## Execution Rules

- Read the entire transcript file before summarizing.
- Do not invent facts. If something is missing, write `Not found` or `Not provided`.
- Use verified external research to enrich the company, role, interviewer, and process sections.
- Clearly separate transcript-derived information from externally verified information.
- Keep the output in markdown with small headers such as `###` and `####`.
- Organize each summary section as a compact markdown table when the content fits naturally in tabular form.
- Save the final summary in the same folder as the transcript, following the naming rules in [reference.md](reference.md).

## Workflow

### 1. Ask for interviewer metadata and transcript path

Ask for:

- Interviewer name
- Interviewer email
- Interviewer LinkedIn
- Interviewer WhatsApp
- Interviewer role / rule
- Full transcript file path

Do not skip this step.

### 2. Read the full transcript

Read the entire transcript file from disk before analyzing it.

- Do not summarize from partial snippets if the full file is available.
- Preserve the distinction between interviewer statements, candidate statements, and inferred outcomes.

### 3. Extract interview facts

Identify:

- Company name and context
- Interviewer identity and background clues
- Role title, seniority, scope, and team
- Tech stack, responsibilities, and expectations
- Hiring process, timeline, and next steps
- Positive signals, concerns, and unknowns

### 4. Run focused external research

Verify and enrich the summary with public information from reliable sources such as:

- Official company website
- LinkedIn
- Glassdoor
- Crunchbase
- Public job postings

Use only information you can verify. If a detail cannot be confirmed, mark it as `Not found`.

### 5. Write the summary

Use the structure in [reference.md](reference.md).

Requirements:

- Keep the report scannable and decision-oriented.
- Focus on information relevant to Senior or Staff Software Engineer evaluation.
- Use small markdown headers only.
- Prefer markdown tables for section details, using free text only when a table would become unreadable.
- Distinguish `Transcript` notes from `External research` notes where useful.
- Follow the table-oriented structure and field guidance in [reference.md](reference.md).

### 6. Save the markdown file beside the transcript

Write the final report in the same directory as the transcript.

Use these filename rules:

- If the transcript ends with `.mp4_speaker_transcript.txt`, replace that suffix with `_summary.md`.
- If the transcript ends with `_speaker_transcript.txt`, replace that suffix with `_summary.md`.
- Otherwise, remove the final file extension and append `_summary.md`.

## Completion Criteria

- The interviewer fields were asked first.
- The full transcript file was read before summarization.
- The final output is a markdown file in the same folder as the transcript.
- The summary follows the reference structure, uses small headers, and organizes section details in tables where practical.
- Missing information is labeled clearly instead of guessed.
