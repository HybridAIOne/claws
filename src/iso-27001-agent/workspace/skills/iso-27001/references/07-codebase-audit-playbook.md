# Codebase / App Audit Playbook

*The method the agent follows to assess a repository or application for ISO/IEC
27001:2022 readiness. Compiled 22 June 2026. Produces technical evidence and a
gap analysis for human review — not a certification, not legal/audit advice.*

Work in five passes. The framing pass (1) is non-negotiable: stating the scope
boundary up front keeps the whole assessment honest.

## Pass 1 — Set scope and expectations

- State that ISO 27001 certifies an **ISMS**, not a repo. A code/CI/cloud review
  evidences mainly **A.8** plus the technical half of a few **A.5** controls;
  **A.6 (people)**, **A.7 (physical)**, and most governance (A.5 + clauses 4–10)
  are out of a scanner's reach and must be evidenced separately.
- State that **config ≠ effectiveness**: a present config shows capability, not an
  operated process. Findings are *evidence toward* a control, never "control
  passed."
- Confirm the target version is **27001:2022 (incl. Amd 1:2024)**; flag any 2013
  references as outdated (see [`02-version-and-status.md`](02-version-and-status.md)).

## Pass 2 — Detect technical evidence

Use the bundled scanner as a first sweep, then confirm by reading code/config:

```bash
node skills/iso-27001/iso-27001-scan.cjs scan <path-to-repo>
```

It looks for **evidence** signals (CI security, dependency/secret scanning, IaC,
encryption, IAM/MFA, logging, backup) and **risk** signals (committed secrets,
weak crypto, disabled TLS verification), each tagged with Annex A control IDs.
Also look directly for: `.github/workflows`, `dependabot.yml`/`renovate.json`,
`CODEOWNERS`, branch-protection settings, lockfiles, SBOMs, Terraform/Helm,
secret-manager usage, logging/SIEM config, and security policy docs.

## Pass 3 — Map evidence to Annex A controls

For each applicable software-relevant control (see
[`06-software-evidence-map.md`](06-software-evidence-map.md)), gather the concrete
evidence (`path:line`) — or its absence. Cover at least: secure development &
coding (A.8.25–A.8.31), change & config (A.8.32, A.8.9), vulnerability mgmt
(A.8.8), crypto & secrets (A.8.24, A.5.17), access & identity (A.5.15–A.5.18,
A.8.2/8.3/8.5), logging & monitoring (A.8.15–A.8.17), data protection
(A.8.10–A.8.13), network/cloud/resilience (A.8.20–A.8.23, A.5.23, A.8.14, A.5.30),
and threat intel (A.5.7).

## Pass 4 — Status each control and find gaps

Mark each in-scope control **Implemented / Partial / Missing / N-A /
Process-evidence-needed**, with the file evidence or a note that it is an
organisational control outside the repo. For each gap, note the **risk** it
leaves and the remediation. Distinguish:

- **Technical gap** — fixable in code/config (e.g. add secret scanning, enable
  at-rest encryption, gate CI on Critical CVEs).
- **Process/documentation gap** — needs a policy, a record, or an operated
  routine the scanner can't see (e.g. access-review sign-offs, restore tests, the
  risk treatment plan, management review minutes).

## Pass 5 — Report (SoA-style)

Produce the report from
[`assets/compliance-report-template.md`](../assets/compliance-report-template.md):
scope + boundary statement, evidence inventory, a **control-by-control table
(SoA-style)** with status and `path:line` evidence, a prioritised remediation
plan separating technical vs. process gaps, and the standing disclaimers
(not-a-certification, copyright, version). Offer the **SoA starter** in
[`assets/soa-template.md`](../assets/soa-template.md) as a deliverable.

## Guardrails for the agent

- **Evidence, not verdicts.** "Evidence found for / gap in" a control — never
  "compliant" or "certified."
- **Cite the control** (and clause where relevant) for every finding.
- **Honour the boundary.** Always note that people/physical/governance evidence
  is required beyond what a codebase shows.
- **Config ≠ process.** Pair green configs with the operational records an auditor
  would want.
- **Never fabricate** a control number, date, or threshold (ISO sets no specific
  SLA/retention numbers — those are org-defined). If unsure, check
  [`08-sources.md`](08-sources.md) or say so.
