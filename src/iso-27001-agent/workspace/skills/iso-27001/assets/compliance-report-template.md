# ISO/IEC 27001:2022 Readiness Assessment — {{project name}}

- **Assessed by:** ISO 27001 Agent (`iso-27001` skill)
- **Date of assessment:** {{YYYY-MM-DD}}
- **Reference pack version:** snapshot 22 June 2026 (ISO/IEC 27001:2022 + Amd 1:2024)
- **Scope of review:** {{repos / services / cloud accounts reviewed}}
- **Live re-verification performed:** {{yes/no}}

> ⚠️ **Not a certification and not legal/audit advice.** This is a technical
> readiness assessment and a set of evidence signals for human review. Only an
> **accredited certification body** can certify an ISMS. A codebase/cloud review
> covers mainly **A.8** plus the technical half of a few **A.5** controls —
> people (A.6), physical (A.7), and governance/process (most A.5 + clauses 4–10)
> need evidence not visible here. **A config proves capability, not an operated
> process.**

---

## 1. Executive summary

- **Overall readiness (technical subset):** {{strong / partial / early}}
- **Headline strengths:** {{2–4 bullets}}
- **Most material gaps:** {{2–5 bullets, technical and process}}
- **Top priority:** {{the single most important action}}

## 2. Scope & boundary

- **In scope (this review):** {{technological controls A.8; technical half of A.5}}
- **Out of scope (needs separate evidence):** people (A.6), physical (A.7), ISMS
  governance & clauses 4–10, supplier/contract and incident *process* evidence.
- **Version confirmed:** 27001:2022 (+ Amd 1:2024). {{note any 2013 artifacts}}

## 3. Evidence inventory

| AI/security capability | Where (path/service) | Tool / mechanism |
| --- | --- | --- |
| {{e.g. dependency scanning}} | {{.github/dependabot.yml}} | {{Dependabot}} |

## 4. Control-by-control status (SoA-style)

Status each in-scope control: **Implemented / Partial / Missing / N-A /
Process-evidence-needed**. (Full control list: `references/03-annex-a-controls.md`.)

| Control | Status | Evidence (`path:line`) / note | Gap & remediation | Type |
| --- | --- | --- | --- | --- |
| A.8.28 Secure coding | {{}} | {{}} | {{}} | tech |
| A.8.8 Technical vulnerabilities | {{}} | {{}} | {{}} | tech |
| A.8.24 Use of cryptography | {{}} | {{}} | {{}} | tech |
| A.8.15 Logging | {{}} | {{}} | {{}} | tech |
| A.8.16 Monitoring activities | {{}} | {{}} | {{}} | tech |
| A.8.32 Change management | {{}} | {{}} | {{}} | tech |
| A.8.9 Configuration management | {{}} | {{}} | {{}} | tech |
| A.8.31 Env separation | {{}} | {{}} | {{}} | tech |
| A.8.13 Information backup | {{}} | {{}} | {{}} | tech |
| A.5.15–A.5.18 Access control & identity | {{}} | {{}} | {{}} | tech/process |
| A.8.5 Secure authentication (MFA) | {{}} | {{}} | {{}} | tech |
| A.8.11 Data masking | {{}} | {{}} | {{}} | tech |
| A.5.23 Cloud services | {{}} | {{}} | {{}} | tech/process |
| A.5.30 ICT readiness for BC | {{}} | {{}} | {{}} | tech/process |
| {{add others as relevant}} | | | | |

## 5. Prioritised remediation plan

| Priority | Action | Control(s) | Type (tech/process) | Owner | Target |
| --- | --- | --- | --- | --- | --- |
| P0 | {{}} | {{A.x}} | {{}} | {{}} | {{}} |

## 6. Process & documentation gaps (not visible in code)

- {{ISMS scope, risk assessment & SoA, access-review sign-offs, restore tests,
  internal audit, management review, incident-response records, supplier
  contracts, people/physical controls…}}

## 7. Assumptions, open questions & next steps

- {{what code couldn't establish; what to confirm with the team}}
- Offer the **SoA starter** (`assets/soa-template.md`) as a follow-up deliverable.

## 8. Sources consulted

- {{primary sources from references/08-sources.md, with any re-verification notes}}
