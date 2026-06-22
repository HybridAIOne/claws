# Data Protection Impact Assessment — DPIA (Art. 35/36)

A DPIA (German: *Datenschutz-Folgenabschätzung*) is required **before** processing
that is **likely to result in a high risk** to individuals' rights and freedoms
(Art. 35(1)).

## When it's required

**Mandatory cases (Art. 35(3)):**
- (a) systematic & extensive **evaluation/profiling** with legal or similarly
  significant effects;
- (b) **large-scale** processing of **special-category** (Art. 9) or
  criminal-conviction (Art. 10) data;
- (c) **systematic monitoring of a publicly accessible area** on a large scale.

Also consult your authority's **Art. 35(4) "blacklist"** of operations that always
need a DPIA (each EU authority publishes one).

**EDPB nine criteria** (WP248) — treat two or more as a strong signal a DPIA is
needed: evaluation/scoring; automated decisions with legal/significant effect;
systematic monitoring; sensitive/highly personal data; large scale; matching/
combining datasets; vulnerable data subjects (employees, children, patients); novel
technology; processing that prevents people from exercising a right/using a service.

If you conclude no DPIA is needed, **document that screening decision** — that
record is itself accountability evidence.

## How to run it (Art. 35(7))

1. **Describe** the processing: nature, scope, context, purposes; data flows;
   recipients; retention. (Reuse the ROPA entry.)
2. **Assess necessity & proportionality**: lawful basis, data minimisation,
   accuracy, storage limitation, transparency, how rights are honoured.
3. **Identify & assess risks** to individuals (likelihood × severity): illegitimate
   access, unwanted modification, disappearance of data; consequences to people.
4. **Identify measures** to address each risk (Art. 32 TOMs, pseudonymisation,
   access controls, retention limits, contractual/organisational safeguards) and
   the residual risk.
5. **Seek the views** of data subjects/representatives where appropriate
   (Art. 35(9)); **involve the DPO** (Art. 35(2)).
6. **Prior consultation (Art. 36):** if high residual risk **remains** after
   mitigations, consult the supervisory authority *before* starting.
7. **Review** when the risk changes (Art. 35(11)).

## Template (skeleton)

```
DPIA: «processing / feature»                    Date: «…»   Owner: «…»   DPO involved: «y/n»
1. Description: purposes, data subjects, data categories (Art. 9? y/n), flows,
   recipients, transfers, retention.
2. Necessity & proportionality: lawful basis «Art. 6(1)(…)»; minimisation;
   transparency; how each right is met.
3. Risks (likelihood × severity):
   - Risk: «…»  →  Likelihood «L/M/H»  Severity «L/M/H»
4. Measures & residual risk:
   - Measure: «…»  →  Residual «L/M/H»
5. Consultation: data subjects «…»; DPO opinion «…».
6. Outcome: «proceed | proceed with measures | prior consultation (Art. 36) | do
   not proceed».
```

> A DPIA is a living risk document, not a checkbox. High residual risk → Art. 36
> prior consultation is a legal step; confirm the call with the DPO/counsel.
