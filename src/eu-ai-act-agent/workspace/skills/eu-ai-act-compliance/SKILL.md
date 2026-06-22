---
name: eu-ai-act-compliance
description: "Assess whether a codebase or app complies with the EU AI Act (Regulation (EU) 2024/1689) — detect AI usage, classify the risk tier, determine provider/deployer role, map obligations, and produce a grounded, citation-backed gap report. Grounding pack current to 22 June 2026."
user-invocable: true
requires:
  bins:
    - node
metadata:
  hybridclaw:
    category: compliance
    short_description: "EU AI Act conformity review for codebases and apps, grounded in the current regulation text and guidance."
    tags:
      - eu-ai-act
      - compliance
      - governance
      - risk-assessment
      - regulation
      - audit
    stakes_tiers:
      green:
        - scan
        - classify
        - assess
        - report
        - explain
    escalation:
      writes: none
      route: human-legal-review
---

# EU AI Act Compliance

Use this skill to check a **codebase or application** against the **EU AI Act
(Regulation (EU) 2024/1689)** and produce a structured, citation-backed
compliance assessment. The skill is **read-only and analytical** — it inspects
code and documents and writes a report; it never changes the target system.

> **Not legal advice.** Output is a technical/organisational assessment and a set
> of signals for human review, not a legal determination. Say this to the user,
> and route classification and prohibited-practice calls to qualified counsel.

## Grounding — read the references first

All substantive claims must be grounded in the bundled reference pack and tagged
with the Article/Annex relied on. Start at
[`references/00-index.md`](references/00-index.md) and read the file(s) relevant
to the question. **Always check [`references/02-timeline-and-status.md`](references/02-timeline-and-status.md)**
before quoting an application date — the high-risk timeline is being postponed by
the **Digital Omnibus**, which (as of the 22 June 2026 snapshot) is *agreed but
not yet law*. The pack is dated; when material time has passed, re-verify via
[`references/09-sources.md`](references/09-sources.md).

## Default workflow

Follow the five passes in
[`references/08-codebase-audit-playbook.md`](references/08-codebase-audit-playbook.md):

1. **Detect** AI/ML usage — run the scanner (below), then confirm by reading code.
2. **Determine the role(s)** — provider, deployer, importer/distributor (Art. 3).
3. **Classify the risk tier** — prohibited (Art. 5) → high-risk (Art. 6 / Annex
   III) → transparency (Art. 50) → GPAI (Ch. V) → minimal. Stop at the highest
   match; record every tier that applies.
4. **Map obligations & find gaps** — for each tier, evidence each control in the
   repo (`path:line`) or mark it Missing / Needs-legal-review.
5. **Report** — fill [`assets/compliance-report-template.md`](assets/compliance-report-template.md):
   summary, inventory, classification with reasoning, gap table, prioritised
   remediation (tie each gap to its Article and fine tier), disclaimer + dates.

## Scanner — command contract

A dependency-free Node helper that sweeps a target directory for AI Act signals.
It surfaces **signals to investigate, not verdicts**.

```bash
# Show usage
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --help

# Scan a repository (human-readable summary)
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs scan /path/to/repo

# Scan and emit structured JSON (preferred for building the report)
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --format json scan /path/to/repo

# Verify the helper against its built-in fixtures
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs self-test
```

The scanner groups hits by AI Act relevance: AI/ML **frameworks**, **model
identifiers**, **prohibited-practice** keywords (Art. 5), **high-risk domain**
keywords (Annex III), **GPAI/training** signals (Ch. V), and **transparency**
signals (Art. 50, including whether any "this is AI" disclosure strings exist).
Treat every hit as a lead to confirm by reading the code in context — it has no
knowledge of *purpose*, *context*, or *harm*, which is where the legal tests
actually turn.

## Working rules

- **Cite the provision** for every obligation and finding (e.g. "Art. 14 human
  oversight: Missing").
- **Signals, not verdicts.** Reserve "violation" for clear Art. 5 matches; phrase
  the rest as "likely / investigate" and flag low-confidence calls for legal
  review.
- **Never fabricate** an Article number, date, or standard. If the references
  don't cover it, say so or re-verify against the primary sources.
- **Surface the timeline** honestly: what is in force now vs. what applies in
  2026/2027, and the pending Omnibus postponements.
- The skill performs **no writes to the target** and needs **no credentials or
  network access** to run the core review; live web access is only for
  re-verifying dates/standards against the official sources.

## Validation

```bash
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --help
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs self-test
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --format json scan skills/eu-ai-act-compliance/evals/fixtures
```
