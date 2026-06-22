# Certification, Audit & the Statement of Applicability

*ISO/IEC 27001:2022. Compiled 22 June 2026. Paraphrased, not the standard text.
Not legal/audit advice; only an accredited certification body can certify.*

## Accreditation vs. certification

- A **certification body (CB / registrar)** audits an organisation's ISMS and
  issues the certificate (e.g. BSI, DNV, Schellman, A-LIGN).
- An **accreditation body (AB)** does not audit organisations — it accredits the
  *certification bodies* (auditor competence, impartiality, process). Examples:
  **UKAS** (UK), **ANAB** (US), **DAkkS** (Germany).
- A certificate from an **accredited** CB carries recognised assurance; an
  unaccredited one does not. CBs are accredited against **ISO/IEC 17021-1** plus
  the ISMS-specific **ISO/IEC 27006-1:2024**.

## The audit cycle

- **Stage 1 — readiness / documentation review.** The CB reviews ISMS design:
  scope, policy, risk assessment, risk treatment, and the **Statement of
  Applicability**; identifies gaps; judges readiness for Stage 2.
- **Stage 2 — certification audit.** The CB gathers **evidence that controls and
  clauses operate in practice** (sampling records, interviewing owners). The
  certification decision is made by the CB (independent reviewer), not the
  auditor alone.
- **Certificate validity: 3 years.**
- **Surveillance audits** at planned intervals (typically annually) sample part
  of the ISMS to confirm it is still operating and improving.
- **Recertification** before the 3-year expiry — a fuller audit that renews the
  certificate for a new cycle.

> Source convention note: some material labels surveillance as "years 1 & 2",
> others "years 2 & 3". The substance is consistent: **two surveillance cycles +
> recertification within the three years.**

## The Statement of Applicability (SoA) — clause 6.1.3(d)

The SoA is the **central certification artifact** — the master control inventory
that bridges the risk assessment to actual implementation. It is reviewed in both
Stage 1 and Stage 2; a missing or weak SoA is a serious finding. It must contain:

1. **All 93 Annex A controls** (the four themes).
2. **Applicability** per control — included or excluded.
3. **Justification for inclusion** (tied to the risk assessment / a legal or
   business requirement).
4. **Justification for exclusion** of any control deemed not applicable.
5. **Implementation status** and a link to the supporting policy/procedure or the
   risk treatment.

A starter SoA table is in
[`assets/soa-template.md`](../assets/soa-template.md).

## Mandatory documented information (clauses 4–10)

Auditors expect, at minimum:

| Clause | Documented information |
| --- | --- |
| 4.3 | ISMS **scope** |
| 5.2 | Information security **policy** |
| 6.1.2 | Risk **assessment process** |
| 6.1.3 | Risk **treatment process** + **Statement of Applicability** |
| 6.2 | Information security **objectives** |
| 7.2 | Evidence of **competence** |
| 7.5 | Control of **documented information** |
| 8.1 | Operational **planning & control** evidence |
| 8.2 | **Results** of risk assessments |
| 8.3 | **Results** of risk treatment (incl. the risk treatment plan) |
| 9.1 | **Monitoring & measurement** evidence |
| 9.2 | **Internal audit** programme + results |
| 9.3 | **Management review** results |
| 10.2 | **Nonconformities & corrective actions** |

Applicable **Annex A controls add further documents** when selected (e.g. asset
inventory, access-control policy, secure-development policy, incident-response
plan, logging) — these are control-driven, recorded via the SoA.

## Keeping certification alive (9.2, 9.3, 10.1, 10.2)

The CB checks this operating loop at every surveillance and recertification:
**internal audits (9.2)** run at planned intervals by impartial auditors;
**management reviews (9.3)** by top management produce decisions/minutes (weak
evidence here is a common Stage 2 failure); **continual improvement (10.1)** and
properly **root-caused, closed corrective actions (10.2)** show the ISMS is
"live." Their absence is a frequent source of nonconformities that jeopardise the
certificate.

*Primary sources in [`08-sources.md`](08-sources.md).*
