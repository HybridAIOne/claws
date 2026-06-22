# ISO/IEC 27001 Reference Pack — Index

**ISO/IEC 27001:2022 — Information security, cybersecurity and privacy
protection — Information security management systems — Requirements.**
Grounding notes compiled **22 June 2026** for the `iso-27001` skill.

These files are the agent's primary grounding. Read the relevant one(s) before
making a compliance statement, and cite the clause (4–10) or Annex A control
(A.5–A.8) you rely on.

## Files

| File | Covers |
| --- | --- |
| [`01-isms-overview.md`](01-isms-overview.md) | The ISMS management-system requirements (clauses 4–10), PDCA, the risk-based approach, and the ISO/IEC 27000 family. |
| [`02-version-and-status.md`](02-version-and-status.md) | The 2022 edition vs 2013, the **Amendment 1:2024 climate change** addition, and the **2013→2022 transition (ended 31 Oct 2025)**. **Read this before discussing versions or dates.** |
| [`03-annex-a-controls.md`](03-annex-a-controls.md) | The 93 Annex A controls in 4 themes, the 11 new 2022 controls, the 5 attributes, and how the Statement of Applicability selects them. |
| [`04-certification-and-soa.md`](04-certification-and-soa.md) | Certification & audit process (Stage 1/2, surveillance, 3-year recert), accreditation, the Statement of Applicability, and mandatory documented information. |
| [`05-risk-assessment-and-treatment.md`](05-risk-assessment-and-treatment.md) | Clauses 6.1.2 / 6.1.3: risk assessment, the four treatment options, the risk treatment plan, residual-risk acceptance, ISO 27005. |
| [`06-software-evidence-map.md`](06-software-evidence-map.md) | How Annex A (mainly A.8 + part of A.5) maps to concrete code / CI / cloud evidence. |
| [`07-codebase-audit-playbook.md`](07-codebase-audit-playbook.md) | The method: scope → detect evidence → map to controls → SoA-style gap report. |
| [`08-sources.md`](08-sources.md) | Authoritative sources, the copyright note, and the re-verification protocol. |

## How to read these notes

- **Clause / control references are load-bearing.** Tag every claim with its
  clause (e.g. "6.1.3") or Annex A control (e.g. "A.8.28"). If the agent can't
  point to one, it should say so.
- **A codebase audit covers a *subset* of the ISMS.** ISO 27001 certifies an
  organisation's whole **ISMS**, not a repository. Code/CI/cloud inspection
  produces evidence mainly for the **technological controls (A.8)** plus the
  technical half of a few organisational controls (A.5). People (A.6), physical
  (A.7), and governance/process controls (most of A.5, plus clauses 4–10) need
  evidence a scanner never sees. Always say this.
- **Config ≠ effectiveness.** A config file proves a capability *exists*; audit
  evidence pairs it with operational records (triaged findings, closed tickets,
  restore-test results). Flag this whenever reporting a "green" config.

## Standing disclaimers (repeat them to users)

1. **Not legal/audit advice and not a certification.** This skill produces a
   technical readiness assessment and signals — it is **not** an accredited audit
   and cannot grant or guarantee certification. Only an accredited certification
   body can certify an ISMS.
2. **Copyright.** ISO/IEC 27001 and 27002 are copyrighted standards sold by ISO.
   These notes summarise structure, list control reference numbers and short
   titles (factual identifiers), and paraphrase intent **in original wording** —
   they do **not** reproduce the standard's text. For authoritative wording,
   work from a **licensed copy** of the standard (see [`08-sources.md`](08-sources.md)).
3. **Time sensitivity.** The compile date above is the freshness marker; the
   2022 edition and the 2024 climate amendment are current as of then.
