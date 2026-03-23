---
name: d3-survey-dashboarding
description: Use this skill when the task needs a custom D3.js survey visualization or story experience that standard BI tools or Plotly cannot express well, including bespoke interaction models, scrollytelling, dense crosstab explorers, custom benchmarks, animated trend narratives, or highly tailored web-native survey dashboards.
---

# D3 Survey Dashboarding

Use this skill for survey storytelling and exploratory interfaces that genuinely need custom web-native interaction. Reach for D3 only when standard dashboard tooling will not express the structure, motion, or density clearly enough.

If the task is mostly about survey methodology, crosstabs, trend interpretation, or ordinary dashboarding, use `survey-design-and-analysis`, Tableau, Power BI, or Plotly first.

## Default Workflow

1. Confirm why D3 is warranted instead of Tableau, Power BI, or Plotly.
2. Define the data contract up front: source tables, derived metrics, ordering rules, and denominator logic.
3. Sketch the interaction model before coding: filters, drill state, scroll steps, hover or focus behavior, and responsive breakpoints.
4. Keep data preparation outside the draw functions whenever possible.
5. Build with explicit `draw`, `update`, and `resize` patterns so the visualization stays maintainable.
6. QA keyboard access, tooltip behavior, reduced-motion behavior, and mobile readability.

## Good Uses For D3

- scrollytelling survey narratives
- dense crosstab explorers
- custom benchmark or wave-change explainers
- bespoke question-flow or response-path visuals
- interactions that need more control than stock chart libraries provide

## Implementation Rules

- Keep state serializable and predictable.
- Use derived data structures instead of recalculating everything inside event handlers.
- Prefer SVG for annotation-heavy views and canvas only when data volume justifies it.
- Keep animation purposeful and short.
- Show base sizes, weighting notes, and comparability caveats in the interface, not just in prose around it.

## Deliverables

When the user wants an implementation plan or scaffold, return:

- data schema and transformation notes
- component architecture
- interaction state model
- chart rendering plan
- accessibility and responsive checklist
- any D3 code scaffold needed to start cleanly

## Default Output Structure

- why D3 is justified
- data contract
- component and interaction architecture
- rendering and update plan
- accessibility and responsive QA
- methodology warnings that must remain visible in the UI

## Pitfalls

- Do not use D3 just because it is flexible.
- Do not bury survey methodology in hidden tooltips.
- Do not let animation or novelty obscure the comparison the user actually cares about.
- Do not assume a browser-served artifact exists unless you created and verified it.
