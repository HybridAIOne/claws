---
name: survey-design-and-analysis
description: Use this skill when the task is to design a survey, review questionnaire wording, define answer options or skip logic, plan crosstabs, choose weighting or denominator rules, interpret trends across waves, write topline insights, or create an analysis brief before building a dashboard in Tableau, Power BI, Plotly, or D3.
---

# Survey Design And Analysis

Use this skill for the survey-methodology layer that sits before dashboard implementation. It is the right entry point when the user needs help deciding what to ask, how to structure answers, how to analyze cuts and waves, or how to turn raw responses into a trustworthy brief.

## Default Workflow

1. Identify the decision, audience, respondent population, mode, timing, and success metric.
2. Determine whether the task is instrument design, data analysis, trend interpretation, or dashboard briefing.
3. Audit question wording, answer options, skip logic, scale direction, and comparability across waves.
4. Define the analysis plan: segments, cuts, weighting rules, denominators, top-box or bottom-box logic, nets, benchmarks, and trend windows.
5. Produce a reviewable draft first when material assumptions are missing.
6. When the analytical brief is stable and the user wants implementation, hand off to Tableau, Power BI, Plotly, or D3 with explicit specs.

## Survey Design Rules

- Start from the decision, not the questionnaire template.
- Keep each question to one idea.
- Use neutral wording and balanced scales.
- Make answer options mutually exclusive and collectively exhaustive where possible.
- Put sensitive, difficult, or open-ended items later unless they are essential screeners.
- Treat skip logic, quotas, and branching as part of the instrument, not an afterthought.

## Crosstab And Trend Rules

- State the denominator for every percentage.
- Separate weighted and unweighted views clearly.
- Flag low base sizes before interpreting differences.
- Keep segment labels, answer order, and scale direction stable across tables and waves.
- Call out wording changes, mode changes, or sampling changes before comparing trends.
- Avoid causal claims unless the study design supports them.

## Default Deliverables

When the user does not specify a format, default to one of these:

- questionnaire or survey-design brief
- crosstab plan
- topline insight summary
- trend memo
- dashboard analysis brief
- methodology and QA checklist

## Default Output Structure

- decision and audience
- assumptions and open questions
- survey or analysis approach
- key cuts, metrics, and weighting rules
- findings or recommended question design
- dashboard handoff notes, if implementation is next

## Handoff To Dashboard Skills

- Use Tableau or Power BI when the user wants BI-platform calculations, pages, and interactions.
- Use Plotly when the user wants code-first interactive charts or Dash-style outputs.
- Use D3 when the interaction needs to be custom and web-native beyond normal dashboard patterns.
- Hand off with explicit field definitions, calculation logic, segment rules, ordering, and QA notes.

## Pitfalls

- Do not confuse respondent-level and response-level counts.
- Do not report directional movement without checking comparability.
- Do not over-interpret tiny subgroup differences.
- Do not treat survey software exports as analysis-ready without checking labels, missing codes, and duplicated rows.
