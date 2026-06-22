# EU AI Act Reference Pack — Index

**Regulation (EU) 2024/1689 (the "Artificial Intelligence Act").**
Grounding notes compiled **22 June 2026** for the `eu-ai-act-compliance` skill.

These files are the agent's primary grounding. Read the relevant one(s) before
making any compliance statement, and cite the Article/Annex you rely on. When a
question turns on exact statutory wording, prefer the primary sources in
[`09-sources.md`](09-sources.md) over these summaries.

## Files

| File | Covers |
| --- | --- |
| [`01-scope-and-definitions.md`](01-scope-and-definitions.md) | What counts as an "AI system" (Art. 3(1)), who is in scope (Art. 2), provider/deployer/importer/distributor roles, extraterritorial reach, exclusions, open-source nuances. |
| [`02-timeline-and-status.md`](02-timeline-and-status.md) | Phased application dates (Art. 113) and the **current legislative status**, including the **Digital Omnibus** postponements (agreed, not yet law). **Read this first.** |
| [`03-prohibited-practices.md`](03-prohibited-practices.md) | The Article 5 banned practices (unacceptable risk). |
| [`04-high-risk-systems.md`](04-high-risk-systems.md) | High-risk classification (Art. 6 + Annex III), the Art. 6(3) derogation, and the full provider + deployer obligation set. |
| [`05-gpai-models.md`](05-gpai-models.md) | General-purpose AI model obligations (Arts. 51–56), the systemic-risk threshold, and the GPAI Code of Practice. |
| [`06-transparency-obligations.md`](06-transparency-obligations.md) | Article 50 transparency duties (chatbots, synthetic-content marking, deep fakes, emotion recognition). |
| [`07-penalties-and-governance.md`](07-penalties-and-governance.md) | Fines (Arts. 99 & 101), enforcement authorities, the AI Office, and published official guidance. |
| [`08-codebase-audit-playbook.md`](08-codebase-audit-playbook.md) | The method: detect → classify → determine role → map obligations → gap report. |
| [`09-sources.md`](09-sources.md) | Authoritative source URLs, retrieval dates, and the re-verification protocol. |

## How to read these notes

- **Article references are load-bearing.** Each claim is tagged with its Article
  or Annex. If the agent cannot point to a provision, it should say so rather
  than invent one.
- **Enacted vs. pending.** The enacted text is Regulation (EU) 2024/1689 as
  published in the Official Journal on 12 July 2024. Proposed changes (notably
  the 2025–2026 **Digital Omnibus**) are flagged inline as *pending* and must
  never be presented as settled law. See [`02-timeline-and-status.md`](02-timeline-and-status.md).
- **Time sensitivity.** Dates, signatory lists, the status of harmonised
  standards, and the Omnibus all move. The compile date above is the freshness
  marker. If today is materially later, re-verify against
  [`09-sources.md`](09-sources.md) before relying on a date or status.

## Standing disclaimer (repeat it to users)

This skill produces a **technical and organisational compliance assessment** and
**signals to investigate** — it is **not legal advice** and is not a substitute
for a qualified assessment by a lawyer or your national competent authority.
Classifications under the AI Act are fact-specific and ultimately a legal
determination. Treat every output as a structured starting point for a human
review.
