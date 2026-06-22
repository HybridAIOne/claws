# Running a GDPR compliance programme

Accountability (Art. 5(2)) means turning obligations into controls that are
**documented, enforced, and evidenced**. A control that lives only as a habit does
not demonstrate compliance. This is a generic, phased method for getting and
staying compliant — size each phase to your risk and resources.

## Status legend

✅ implemented · 🟡 partial · ⬜ planned — track each workstream this way so the
state is auditable at a glance.

## Phase 1 — Map (foundation)

- Build the **ROPA** ([ropa.md](ropa.md)) — every processing activity, role,
  lawful basis, data categories, recipients, retention, transfers.
- Classify **special-category** processing (Art. 9) and flag elevated activities.
- Output: a current data inventory that every later phase reuses.

## Phase 2 — Lawful basis & transparency

- Assign and document a **lawful basis** (Art. 6; + Art. 9(2) where needed) per
  activity.
- Write/refresh the **privacy notice** (Art. 13/14): identity, purposes, bases,
  recipients, transfers, retention, rights, complaint route.
- Get **consent** right where it's the basis ([consent-and-eprivacy.md](consent-and-eprivacy.md)).

## Phase 3 — Data-subject rights

- Stand up a **process** to fulfil access/erasure/rectification/portability/
  objection within one month ([data-subject-rights.md](data-subject-rights.md)) —
  even a manual, logged process counts; automate self-service where it pays off.

## Phase 4 — Security of processing

- Implement and document **TOMs** (Art. 32, [security-of-processing.md](security-of-processing.md));
  apply **by design & by default** (Art. 25). Retire weak crypto; keep PII out of
  logs; isolate tenants.

## Phase 5 — Retention & minimisation

- Define a **retention period** per data category and **enforce deletion**
  (Art. 5(1)(c)/(e)) — ideally scheduled/automated, not manual.

## Phase 6 — Processors & transfers

- Sign **DPAs/AVVs** (Art. 28), keep a **sub-processor list**, and put a valid
  **transfer mechanism** + TIA behind every non-EEA flow
  ([processors-and-dpa.md](processors-and-dpa.md),
  [international-transfers.md](international-transfers.md)).

## Phase 7 — Governance & incident readiness

- **DPIAs** for high-risk processing ([dpia.md](dpia.md)); **DPO** determination
  (Art. 37 + BDSG §38) and contact published if applicable; a tested **72-hour
  breach** process + register ([breach-notification.md](breach-notification.md));
  staff training; a review cadence (annual or on material change).

## Evidence to keep (the audit asks for these)

ROPA · privacy notices + versions · consent records · DSR log · DPIAs + screening
decisions · DPAs + sub-processor list · transfer mechanisms + TIAs · TOMs
description · breach register · retention schedule · training records · DPO
appointment. Each is a deliverable of the phases above.

> This method organises the work; it does not certify the outcome. Have the DPO/
> counsel review the programme and sign off the legal determinations (DPO need,
> DPIA outcomes, transfer legality, contract terms).
