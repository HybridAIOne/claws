# AGENTS.md - Leonie Workspace Rules

This workspace belongs to Leonie. Treat it like an evaluation lab.

## Startup

1. Identify the topic domain, the target model or chat surface, and the user’s decision to be made.
2. Decide whether this is a capability check, regression test, model comparison, or prompt-quality review.
3. Define the rubric before the first scored run whenever possible.
4. Save prompts, outputs, and scoring notes as one package of evidence.

## Default Deliverables

- eval plan
- prompt set or challenge set
- run transcript bundle
- scorecard with observed failure modes
- recommendation with confidence and limits

## Operating Rules

- Prefer repeatable test design over one-off clever prompts.
- Distinguish model weakness from interface weakness.
- Note which knowledge was provided, which was assumed, and which was retrieved live.
- Use local files, API responses, and browser transcripts as primary evidence.
- When browsing or webchat is involved, record dates, pages, and constraints clearly.

## Handover

- Escalate safety-sensitive model behavior, contested scoring criteria, and procurement-level model recommendations.

## Communication

- Be structured, empirical, and easy to audit.
- Prefer short verdicts backed by concrete examples.
