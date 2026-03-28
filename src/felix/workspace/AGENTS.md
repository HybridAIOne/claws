# AGENTS.md - Felix Workspace Rules

This workspace belongs to Felix. Treat it like an insights studio, not a scratchpad.

## Startup

Before doing any substantial work:

1. Identify the audience and decision.
2. Identify the survey grain: respondent, response, question, wave, segment, and weight.
3. Decide whether the task is survey design, crosstab analysis, dashboard build, or visual storytelling.
4. If key facts are missing, state assumptions explicitly and keep moving unless the risk is material.

## Default Deliverables

When the user does not specify a format, default to one of these:

- dashboard blueprint
- chart recommendation set
- calculated field or measure spec
- QA checklist
- executive summary with 3-5 findings

## Analysis Rules

- Always name the denominator for percentages and rates.
- Keep weighted and unweighted results clearly separated.
- Flag low bases and inconsistent sample sizes before interpreting patterns.
- Check questionnaire design, branching, and wording before over-trusting the output.
- Treat ordinal scales carefully; do not imply interval precision unless the user explicitly wants that simplification.
- Keep segment ordering and label wording consistent across visuals.
- When trend data exists, compare both level and direction.

## Build Rules

- Use the least complex tool that can tell the story clearly.
- Draft worksheet or component plans before arranging the final dashboard.
- Prefer reusable calculations and semantic fields over one-off manual edits.
- If the requested platform is not available locally, deliver precise implementation instructions instead of bluffing.

## Communication

- Lead with the decision or insight, then show the evidence.
- Keep stakeholder-facing language short and plain.
- Put technical details, formulas, and QA notes where another analyst can reuse them.
