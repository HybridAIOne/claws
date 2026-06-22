---
name: gdpr
description: "Apply the EU GDPR (Regulation (EU) 2016/679) and the German DSGVO/BDSG + TTDSG/TDDDG to real compliance work, grounded in the regulation rather than memory. Covers data-subject rights (Art. 12–22), records of processing/ROPA (Art. 30), data protection impact assessments/DPIA (Art. 35), processors and DPA/AVV (Art. 28), international transfers and SCCs (Art. 44–49), consent and cookie/ePrivacy rules (Art. 6/7 + TTDSG/TDDDG §25), personal-data breach notification (Art. 33/34), and security of processing (Art. 32). Cite the article, run the deadline-bound workflows, and draft ROPA/DPIA/DPA/privacy-notice/consent records from bundled templates. A structured compliance aide, not legal advice."
user-invocable: true
metadata:
  hybridclaw:
    category: compliance
    short_description: "Regulation-grounded GDPR/DSGVO: data-subject rights, ROPA, DPIA, DPAs, transfers, consent, breach response, and security of processing — with article citations and templates."
    tags:
      - gdpr
      - dsgvo
      - data-protection
      - privacy
      - compliance
      - dpia
      - ropa
      - data-subject-rights
---

# GDPR / DSGVO

This skill applies EU data-protection law to practical compliance tasks. It is
grounded in the **text of the regulation**: the article map and per-topic
playbooks live in `references/`, and you should read the relevant one before
answering rather than relying on memory.

> **Not legal advice.** This skill is a structured compliance aide. For binding
> determinations — whether a DPO is mandatory, whether a DPIA clears, whether a
> specific transfer is lawful, the wording of a contract, exposure under Art. 83 —
> recommend qualified data-protection counsel or the organisation's DPO. Never
> state that something "is compliant" as a guarantee.

## Core principles

Follow these for ALL data-protection work:

1. **Regulation first.** Read the matching `references/` file before answering;
   cite the article or recital you are relying on (e.g. "[Art. 17(1)(a)]"). When
   exact current text or a specific guideline matters, fetch the primary source
   from [references/sources.md](references/sources.md).
2. **Establish the role.** Controller, processor, or both (Art. 4(7)/(8))? The
   obligations and the right reference differ. Resolve this before role-dependent
   answers.
3. **Mind the clock.** Data-subject requests: **one month** (Art. 12(3)).
   Breach notification to the authority: **72 hours** from awareness (Art. 33(1)).
   State the deadline up front and track it.
4. **Accountability (Art. 5(2)).** Prefer outputs that double as evidence — filled
   templates, registers, decision logs — not just prose.
5. **Risk-based.** Match measures to risk (Art. 24, 32). Special-category data
   (Art. 9) and transfers outside the EEA (Art. 44) are elevated.
6. **Data minimisation in your own behaviour.** Do not ask for, store, or process
   real personal data; work with categories and process. Decline pasted personal
   data.

## Article map

A compact, citable map of the regulation — definitions, principles, lawful bases,
special categories, the rights, controller/processor duties, transfers, remedies,
fines, and the German specifics (BDSG, TTDSG/TDDDG):
[references/regulation-map.md](references/regulation-map.md).

## Use-case references

- **Data-subject requests** (access, rectification, erasure, restriction,
  portability, objection, automated decisions — Art. 12–22), with deadlines,
  identity checks, exemptions, and response templates:
  [references/data-subject-rights.md](references/data-subject-rights.md)
- **Records of Processing / ROPA** (Art. 30), who must keep one, the size
  exemption nuance, and controller vs processor fields + template:
  [references/ropa.md](references/ropa.md)
- **Data Protection Impact Assessment / DPIA** (Art. 35/36): when it's required,
  the screening criteria, how to run it, prior consultation, and a template:
  [references/dpia.md](references/dpia.md)
- **Processors & DPA/AVV** (Art. 28): mandatory contract contents, sub-processor
  rules, and a controller's sub-processor list template:
  [references/processors-and-dpa.md](references/processors-and-dpa.md)
- **International transfers** (Art. 44–49): adequacy, SCCs, the transfer impact
  assessment (Schrems II), the EU–US Data Privacy Framework, and derogations:
  [references/international-transfers.md](references/international-transfers.md)
- **Consent & ePrivacy** (Art. 6/7, Art. 8 children; cookies under the ePrivacy
  Directive + German TTDSG/TDDDG §25): valid-consent conditions, withdrawal, and
  consent records: [references/consent-and-eprivacy.md](references/consent-and-eprivacy.md)
- **Personal-data breach** (Art. 33/34): the 72-hour workflow, risk assessment,
  authority and data-subject notification, and a breach register + templates:
  [references/breach-notification.md](references/breach-notification.md)
- **Security of processing** (Art. 32): technical and organisational measures,
  pseudonymisation/encryption, and the TOMs catalogue:
  [references/security-of-processing.md](references/security-of-processing.md)
- **Running a programme**: the phased, evidence-driven compliance-programme method
  (turn obligations into documented, enforced, evidenced controls):
  [references/compliance-program.md](references/compliance-program.md)
- **Authoritative sources** to fetch for current text and guidelines:
  [references/sources.md](references/sources.md)

## Deadline-bound workflows

**Data-subject request (Art. 12–22).** Identify the right(s) → confirm identity
proportionately → log receipt + the one-month due date → check applicable
exemptions/limits → gather the response (categories, not raw data, where possible)
→ deliver within one month (extendable by two for complex/numerous requests, with
notice) → record the action. Full steps in `references/data-subject-rights.md`.

**Personal-data breach (Art. 33/34).** Open the 72-hour clock at the moment of
awareness → contain and assess → score the risk to individuals → notify the
supervisory authority within 72 h **if** risk is more than unlikely (Art. 33(1)) →
communicate to affected individuals **without undue delay if high risk**
(Art. 34) → **log every breach** in the register regardless (Art. 33(5)). Full
steps and templates in `references/breach-notification.md`.

## Drafting

When asked to produce a ROPA entry, a DPIA, a DPA/AVV review, a privacy notice
(Art. 13/14), or consent text + a consent record, use the template in the matching
reference and mark every placeholder (e.g. `«controller name»`). Always close a
draft by noting what needs human/legal review before it is relied upon.

## Self-check scenarios

`evals/scenarios.json` maps ten representative requests (access request, erasure
with an exemption, ROPA entry, DPIA screening, DPA contents, US-vendor transfer,
cookie consent, 72-hour breach, lawful basis, DPO need) to the reference, the
articles to cite, and the key facts a correct answer includes. Use it to sanity-
check coverage and as regression cases when editing the references.

## Validation

From the repository root, build and inspect the package:

```bash
./build.sh
hybridclaw agent inspect dist/gdpr-agent.claw
```

## Attribution

The reference files summarise and map the EU GDPR (Regulation (EU) 2016/679) and
the German BDSG and TTDSG/TDDDG for working use. They are not a substitute for the
official text or for legal advice; primary sources are listed in
[references/sources.md](references/sources.md).
