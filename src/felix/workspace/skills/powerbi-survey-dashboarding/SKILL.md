---
name: powerbi-survey-dashboarding
description: Use this skill when the task is to design, spec, troubleshoot, or explain a Power BI dashboard for survey data, including Power Query shaping, semantic modeling, DAX measures, slicers, drillthrough, bookmarks, weighted survey metrics, top-box or bottom-box summaries, net scores, and wave or benchmark comparisons.
---

# Power BI Survey Dashboarding

Use this skill for Power BI survey dashboards that need a sound model, reliable measures, and stakeholder-friendly pages. Optimize for semantic clarity first, visuals second.

If the task is mostly about questionnaire design, weighting rules, crosstab planning, or trend interpretation before implementation, use `survey-design-and-analysis` first.

## Default Workflow

1. Define the grain of each table: respondent, response, question, answer option, segment, and calendar or wave.
2. Use Power Query for structural cleanup such as code mapping, answer ordering, label cleanup, and multi-select expansion.
3. Build a star schema whenever possible so DAX measures stay simple and reusable.
4. Create measures for base n, weighted base, percent, top-box, bottom-box, net, benchmark delta, and trend change as needed.
5. Design report pages around user questions: overview, segment cuts, trends, drivers, and detail.
6. QA filter context, relationship direction, hidden denominator shifts, and low-base segments.

## Modeling And DAX Rules

- Prefer measures over calculated columns for aggregations.
- Use explicit sort keys for answer labels and question order.
- Use `DIVIDE` instead of raw division in DAX.
- Keep weighted and unweighted measures distinct.
- Handle multi-select questions carefully so many-to-many behavior does not inflate counts.
- Keep respondent-level calculations separate from response-level calculations.

## Interaction Patterns

- Use slicers for business-relevant segments, not every raw field.
- Use drillthrough only when it answers a clear follow-up question.
- Use bookmarks sparingly and only when they improve the narrative.
- Keep mobile and service reading in mind when laying out dense survey pages.

## Deliverables

When Power BI is not available directly, return:

- proposed table model and relationship notes
- Power Query transformation steps
- DAX measure definitions
- page-by-page visual plan
- slicer, drillthrough, and bookmark behavior
- QA checklist for context, weights, bases, and label order

## Default Output Structure

- decision and audience
- semantic model
- Power Query steps
- DAX measures
- report pages and interactions
- QA and methodology warnings

## Pitfalls

- Do not bury model problems inside complex DAX.
- Do not let relationship ambiguity drive incorrect percentages.
- Do not mix weighted and unweighted outputs on one page without explicit labeling.
- Do not overload one page when separate overview and diagnostic pages would be clearer.
- Do not imply a `.pbix`, service dataset, or published report exists unless it was actually created in the current environment.
