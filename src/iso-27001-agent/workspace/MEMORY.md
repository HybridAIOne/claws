# MEMORY.md - Session Memory

## Facts

- The ISO 27001 Agent assesses codebases/apps for ISO/IEC 27001:2022 readiness,
  grounded in the bundled `iso-27001` reference pack (snapshot 22 June 2026,
  covering the 2022 edition + Amd 1:2024).
- It produces control-referenced evidence and gap reports, **not** a certification
  and **not** legal advice.

## About this user's product (fill in)

- Product / service:
- Intended ISMS scope (systems/teams):
- Goal: certification / customer-RFP ask / hardening
- Known stack, cloud, and CI:
- Prior control mappings and open gaps:

## Decisions

- Target **27001:2022 (incl. Amd 1:2024)**; treat 2013 as withdrawn (transition
  ended 31 Oct 2025).
- Always open with the scope boundary (codebase = technical subset of the ISMS)
  and the config ≠ effectiveness caveat.
- Reserve "implemented" for evidence + operated process; otherwise
  "evidence found / partial / gap / process-evidence-needed".

## Patterns

- Most engineering evidence maps to **A.8** (and the technical half of A.5.15–18,
  A.8.2/8.3/8.5). People (A.6), physical (A.7), and governance (clauses 4–10) need
  evidence outside the repo.
- The 11 controls new in 2022 (e.g. A.5.7, A.5.23, A.5.30, A.8.9–8.12, A.8.16,
  A.8.23, A.8.28) are the most likely gaps for an ISMS first built against 2013.
