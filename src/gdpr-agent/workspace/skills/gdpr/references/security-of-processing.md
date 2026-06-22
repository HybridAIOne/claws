# Security of processing — TOMs (Art. 32)

Art. 32 requires **technical and organisational measures** (TOMs) appropriate to
the risk. It is risk-based, not a fixed checklist: weigh the state of the art, cost,
and the nature/scope/context/purposes against the likelihood and severity of risk
to individuals.

## What Art. 32 names explicitly

- **Pseudonymisation and encryption** of personal data (Art. 32(1)(a)).
- Ongoing **confidentiality, integrity, availability, and resilience** of systems
  (32(1)(b)).
- Ability to **restore** availability and access after an incident (32(1)(c)).
- A process for **regularly testing and evaluating** the effectiveness of the
  measures (32(1)(d)).
- Account for risks from accidental/unlawful destruction, loss, alteration,
  disclosure, or access (32(2)).
- Adherence to an approved **code of conduct / certification** can help demonstrate
  compliance (32(3)).

## A working TOMs catalogue

Map your concrete controls to these headings (this doubles as the ROPA Art. 30(g)
"general description" and a DPA security annex):

- **Access control** — RBAC, least privilege, MFA, joiner/mover/leaver process,
  unique accounts, session timeouts.
- **Encryption** — TLS in transit; encryption at rest; key management; consider
  column/field encryption for the most sensitive data; avoid broken algorithms
  (no MD5/SHA-1 for passwords — use bcrypt/argon2/scrypt).
- **Pseudonymisation/minimisation** — separate identifiers, tokenisation, minimise
  fields collected and logged.
- **Logging & monitoring** — audit trails for access to and changes of personal
  data; alerting; **keep PII out of logs**; bounded log retention.
- **Resilience & recovery** — backups, tested restores, defined RTO/RPO,
  high availability.
- **Secure development** — SDLC, code review, dependency/vuln management, testing
  (see also ISO 27001 Annex A.8 controls if you run an ISMS).
- **Network & infra** — segmentation, firewalls, hardening, patching.
- **Vendor security** — processor due diligence, DPA Art. 32 flow-down, audits.
- **Organisational** — confidentiality obligations, training, policies, incident
  response (ties to [breach-notification.md](breach-notification.md)), retention &
  deletion (Art. 5(1)(e)).
- **Tenant isolation** (multi-tenant SaaS) — enforce and test that one customer's
  data cannot reach another.

## Relationship to other duties

- **By design & by default (Art. 25)** — bake these in up front and default to the
  most privacy-protective settings.
- **DPIA (Art. 35)** — TOMs are the measures that reduce assessed risk.
- **Breach (Art. 32 ↔ 34(3)(a))** — strong encryption of the affected data can
  remove the duty to notify individuals.

> "Appropriate" is a judgement against risk. Document *why* the chosen measures fit
> the risk — that rationale is the accountability evidence (Art. 5(2)/24).
