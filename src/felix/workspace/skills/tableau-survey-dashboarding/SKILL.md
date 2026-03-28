---
name: tableau-survey-dashboarding
description: Use this skill when the task is to design, spec, troubleshoot, or explain a Tableau dashboard for survey or questionnaire data, including worksheets, dashboards, filters, parameters, LOD calculations, table calculations, crosstabs, weighted metrics, top-box or bottom-box summaries, net scores, and wave comparisons.
---

# Tableau Survey Dashboarding

Use this skill for survey-heavy Tableau work. Focus on clean question hierarchies, correct denominators, reusable calculations, and dashboards that explain decisions rather than showing every possible slice.

If the task is mostly about questionnaire wording, weighting strategy, crosstab design, or trend interpretation before a dashboard tool has been chosen, use `survey-design-and-analysis` first.

## Default Workflow

1. Identify the audience, decision, survey wave, respondent grain, segment cuts, and whether outputs must be weighted.
2. Normalize the survey structure into respondent id, question, answer, segment, date or wave, and any weighting fields before thinking about dashboard layout.
3. Decide the metric type for each view: respondent count, weighted percent, top-box, bottom-box, net, mean, rank, or change versus benchmark.
4. Plan worksheets before dashboards so each view has one job.
5. Specify filters, parameters, highlight actions, and drill behavior explicitly.
6. QA denominators, null handling, branching logic, duplicated rows, reversed scales, and low-base segments before presenting findings.

## Tableau Patterns

- Use LOD expressions for respondent-level denominators and fixed-base calculations that must survive filtering.
- Use table calculations only when partitioning and addressing are explicit.
- Keep weighted and unweighted measures separate and label them plainly.
- For Likert questions, prefer diverging stacked bars or top-two-box summaries instead of dense tables.
- For trend tracking, use stable colors, clear wave ordering, and annotations for major shifts.
- For crosstabs, sort segments consistently and surface low-base warnings where interpretation could be shaky.

## Deliverables

When Tableau is not available directly, return:

- data model assumptions
- calculated fields with Tableau syntax
- worksheet list with purpose and grain
- dashboard layout with filters, actions, and parameter behavior
- KPI definitions and denominator notes
- QA checklist covering weights, bases, branch logic, and label consistency

## Default Output Structure

- decision and audience
- required data fields and grain
- Tableau calculated fields
- worksheet plan
- dashboard interaction plan
- QA and methodology warnings

## Pitfalls

- Do not mix respondent counts and response counts without saying so.
- Do not let filters silently change the denominator for headline percentages.
- Do not use flashy dashboard chrome to cover weak analytical structure.
- Do not hide low bases, missing codes, or changed question wording across waves.
- Do not claim a Tableau workbook or published dashboard exists unless it was actually created in the current environment.
