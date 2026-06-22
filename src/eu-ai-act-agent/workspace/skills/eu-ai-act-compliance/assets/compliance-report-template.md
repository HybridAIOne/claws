# EU AI Act Compliance Assessment — {{project name}}

- **Assessed by:** EU AI Act Agent (`eu-ai-act-compliance` skill)
- **Date of assessment:** {{YYYY-MM-DD}}
- **Reference pack version:** snapshot 22 June 2026 (Regulation (EU) 2024/1689)
- **Scope of review:** {{repos / services / features reviewed}}
- **Live re-verification performed:** {{yes/no — what was checked against primary sources}}

> ⚠️ **Not legal advice.** This is a technical and organisational assessment and a
> set of signals for human review. AI Act classifications are fact-specific legal
> determinations. Confirm conclusions with qualified counsel and, where relevant,
> your national competent authority before acting.

---

## 1. Executive summary

- **Overall exposure:** {{none / limited (transparency) / high-risk / prohibited-practice concern / GPAI provider}}
- **Headline findings:** {{2–5 bullets — the things that matter most}}
- **Most urgent action:** {{the single highest-priority item}}
- **Key dates:** prohibitions in force since 2 Feb 2025; GPAI since 2 Aug 2025;
  high-risk Annex III + Art. 50 from **2 Aug 2026** (Digital Omnibus may postpone
  Annex III to 2 Dec 2027 — *pending, not yet law as of the snapshot*).

## 2. System inventory

| # | AI feature / system | Where (path/service) | Model / library | Modality |
| --- | --- | --- | --- | --- |
| 1 | {{e.g. CV-screening scorer}} | {{src/...}} | {{e.g. fine-tuned model / OpenAI API}} | {{text/image/...}} |

## 3. Role & scope

- **Role(s):** {{provider / deployer / importer / distributor — per system}}
- **Territorial scope:** {{EU users or EU-used output? Art. 2}}
- **Exclusions considered:** {{R&D / military / personal — and why they do/don't apply}}

## 4. Risk classification

| System | Tier | Basis (Article / Annex) | Reasoning | Confidence |
| --- | --- | --- | --- | --- |
| {{1}} | {{Prohibited / High-risk / Transparency / GPAI / Minimal}} | {{e.g. Annex III §4 employment}} | {{why}} | {{high/med/low — flag legal-review}} |

## 5. Obligation gap analysis

For each applicable tier, status each obligation: **Met / Partial / Missing /
N-A / Needs-legal-review**, with file evidence.

| Obligation (Article) | Status | Evidence (`path:line`) / note | Gap & remediation |
| --- | --- | --- | --- |
| Human oversight (Art. 14) | {{}} | {{}} | {{}} |
| Logging / records (Art. 12 / 26(6)) | {{}} | {{}} | {{}} |
| Transparency to users (Art. 50) | {{}} | {{}} | {{}} |
| Technical documentation (Art. 11 / Annex IV) | {{}} | {{}} | {{}} |
| Data governance & bias (Art. 10) | {{}} | {{}} | {{}} |
| Accuracy / robustness / security (Art. 15) | {{}} | {{}} | {{}} |
| Risk & quality management (Art. 9 / 17) | {{}} | {{}} | {{}} |
| Registration / conformity (Art. 43, 47–49, 71) | {{}} | {{}} | {{}} |
| GPAI duties (Art. 53 / 55) | {{}} | {{}} | {{}} |
| AI literacy (Art. 4) | {{}} | {{}} | {{}} |

## 6. Prioritised remediation plan

| Priority | Action | Obligation | Fine tier if unaddressed | Owner | Target date |
| --- | --- | --- | --- | --- | --- |
| P0 | {{}} | {{Art.}} | {{7% / 3% / 1%}} | {{}} | {{}} |

## 7. Assumptions, open questions & legal-review items

- {{things the code couldn't establish: purpose, context, deployment geography}}
- {{explicit questions for counsel / the product owner}}

## 8. Sources consulted

- {{primary sources from references/09-sources.md actually relied on, with any
  live re-verification notes}}
