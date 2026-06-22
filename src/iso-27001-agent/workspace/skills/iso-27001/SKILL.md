---
name: iso-27001
description: "Assess a codebase or app for ISO/IEC 27001:2022 readiness — detect technical security evidence, map it to Annex A controls, status each control (implemented/partial/missing/N-A), and produce an SoA-style gap report grounded in the standard's structure. Covers the ISMS clauses (4–10), the 93 Annex A controls in 4 themes, the 11 new 2022 controls, certification & the Statement of Applicability, risk assessment/treatment, and the 2024 climate amendment. A readiness aide, not a certification or legal/audit advice. Grounding pack current to 22 June 2026."
user-invocable: true
requires:
  bins:
    - node
metadata:
  hybridclaw:
    category: compliance
    short_description: "ISO/IEC 27001:2022 readiness for codebases and apps — Annex A control mapping, SoA-style gap report, and a technical-evidence scanner."
    tags:
      - iso-27001
      - isms
      - information-security
      - security
      - compliance
      - annex-a
      - audit
    stakes_tiers:
      green:
        - scan
        - map-controls
        - assess
        - report
        - explain
    escalation:
      writes: none
      route: human-review
---

# ISO/IEC 27001

Use this skill to assess a **codebase or application** for **ISO/IEC 27001:2022**
readiness and produce a structured, control-referenced gap report. The skill is
**read-only and analytical** — it inspects code, CI and config and writes a
report; it never changes the target system.

> **Not a certification, and not legal/audit advice.** Output is a technical
> readiness assessment and evidence signals for human review. Only an
> **accredited certification body** can certify an ISMS. Say this to the user.

## Two hard framing rules (state them every time)

1. **A codebase audit covers a *subset* of the ISMS.** ISO 27001 certifies an
   organisation's whole Information Security Management System, not a repo. A
   code/CI/cloud review evidences mainly the **technological controls (A.8)** plus
   the technical half of a few **organisational controls (A.5)**. People (A.6),
   physical (A.7), and most governance (A.5 + clauses 4–10) need evidence a
   scanner never sees — record those decisions in the **Statement of
   Applicability**.
2. **Config ≠ effectiveness.** A present config proves a capability *exists*, not
   that the process is *operated*. Report findings as *evidence toward* a control,
   never "control passed", and pair green configs with operational records.

## Copyright

ISO/IEC 27001 and 27002 are copyrighted standards. Ground answers in the bundled
references, which list control reference numbers and short titles (factual
identifiers) and paraphrase intent — **do not paste long verbatim extracts of the
standard**, even on request. For audit-grade wording, point the user to a
**licensed copy** (see [`references/08-sources.md`](references/08-sources.md)).

## Grounding — read the references first

Start at [`references/00-index.md`](references/00-index.md). Tag every claim with
its clause (4–10) or Annex A control (A.5–A.8). **Always confirm the target is
27001:2022 (incl. Amd 1:2024)** via
[`references/02-version-and-status.md`](references/02-version-and-status.md) — the
2013→2022 transition ended 31 Oct 2025, so 2013 is withdrawn.

## Default workflow

Follow the five passes in
[`references/07-codebase-audit-playbook.md`](references/07-codebase-audit-playbook.md):

1. **Scope** — state the subset boundary and confirm the 2022 edition.
2. **Detect** technical evidence — run the scanner, then read code/config.
3. **Map** evidence to Annex A controls
   ([`references/06-software-evidence-map.md`](references/06-software-evidence-map.md)).
4. **Status & gaps** — Implemented / Partial / Missing / N-A /
   Process-evidence-needed, split into technical vs. process gaps.
5. **Report** — fill
   [`assets/compliance-report-template.md`](assets/compliance-report-template.md)
   and offer the [`assets/soa-template.md`](assets/soa-template.md) starter.

## Scanner — command contract

A dependency-free Node helper that sweeps a target for ISO 27001 technical signals
(both **evidence** and **risk** anti-patterns), each tagged with Annex A control
IDs. Signals to investigate, not verdicts.

```bash
# Usage
node skills/iso-27001/iso-27001-scan.cjs --help

# Scan a repository (human-readable)
node skills/iso-27001/iso-27001-scan.cjs scan /path/to/repo

# Scan and emit JSON (preferred for building the report)
node skills/iso-27001/iso-27001-scan.cjs --format json scan /path/to/repo

# Verify the helper against its fixtures
node skills/iso-27001/iso-27001-scan.cjs self-test
```

It detects, e.g.: CI security workflows, dependency/secret scanning, lockfiles &
SBOMs, IaC, encryption & secret managers, IAM/MFA/SSO, logging/SIEM, backup
(**evidence**); and committed private keys, weak/legacy crypto, and disabled TLS
verification (**risk**). It only sees the **technical subset** — it cannot
evidence people, physical, or governance controls.

## Working rules

- **Evidence, not verdicts.** "Evidence found for / gap in" a control — never
  "compliant" or "certified."
- **Cite the control** (and clause where relevant) for every finding.
- **Honour the boundary** and the **config ≠ process** rule in every assessment.
- **Never fabricate** a control number, date, or threshold — ISO sets no specific
  SLA/retention/MFA numbers (org-defined). If unsure, re-verify or say so.

## Validation

```bash
node skills/iso-27001/iso-27001-scan.cjs --help
node skills/iso-27001/iso-27001-scan.cjs self-test
node skills/iso-27001/iso-27001-scan.cjs --format json scan skills/iso-27001/evals/fixtures
```
