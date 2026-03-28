---
name: plotly-survey-dashboarding
description: Use this skill when the task is to design, build, or explain Plotly-based survey dashboards, charts, or apps in Python or JavaScript, including interactive Likert charts, crosstab comparisons, trend tracking, benchmark views, HTML exports, Dash prototypes, and survey-specific hover, annotation, and denominator logic.
---

# Plotly Survey Dashboarding

Use this skill for fast interactive survey visuals when the output needs to live in Python, JavaScript, HTML, or Dash. Treat Plotly as the quickest path to a polished interactive prototype that still respects survey methodology.

If the task is mostly about questionnaire design, weighting, crosstabs, toplines, or trend interpretation before chart implementation, use `survey-design-and-analysis` first.

## Default Workflow

1. Pick the runtime first: Python notebook, Dash app, plain HTML export, or JavaScript embed.
2. Reshape the data into a tidy table or summary table before building the chart.
3. Choose the visual pattern that best matches the analytical question.
4. Make hover text and annotations carry the survey context: question wording, base size, weighting status, and benchmark or wave notes.
5. Validate legend behavior, ordering, mobile sizing, and color consistency before delivery.

## Preferred Survey Patterns

- Likert distributions: horizontal stacked bars with fixed category order and stable colors.
- Segment comparisons: dot plots, grouped bars, or small multiples instead of overloaded legends.
- Trend tracking: line charts with annotations for question wording or methodology changes.
- Crosstab heatmaps: only when scale ordering and denominator logic stay readable.
- Open-end theme counts: sorted bars with explicit n and optional sample verbatims outside the chart.

## Implementation Rules

- Preserve survey order with categorical sorting instead of relying on alphabetical defaults.
- Keep color meaning consistent across questions and pages.
- Include base sizes in hover or adjacent annotations when a chart could be misread without them.
- Prefer readable interactions over dense control panels.
- Avoid 3D charts, gratuitous animation, and decorative effects that weaken interpretability.

## Deliverables

When the user wants implementation help, return one of these:

- runnable Plotly code
- a figure spec with traces, layout, colors, and hover behavior
- a Dash page plan with inputs, callbacks, and chart states
- an HTML export strategy for stakeholders

## Default Output Structure

- decision and audience
- input data contract
- chosen chart pattern and why
- Plotly code or trace spec
- hover, filters, and annotations
- QA and methodology warnings

## Pitfalls

- Do not hide denominator changes inside interactive filters.
- Do not let category order drift between charts.
- Do not ship benchmark or wave charts without clear notes on comparability.
- Do not pretend an interactive app was executed or exported if you only produced a spec.
