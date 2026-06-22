# High-Risk AI Systems

*Regulation (EU) 2024/1689. Compiled 22 June 2026. Not legal advice.*
This is the most demanding regime for ordinary software teams. Most of it applies
from **2 August 2026** for Annex III use-cases (Annex I product-embedded systems:
2 August 2027) — subject to the pending Digital Omnibus postponements in
[`02-timeline-and-status.md`](02-timeline-and-status.md).

## 1. Is it high-risk? (Article 6)

Two routes:

- **Route 1 — Annex I products (Art. 6(1)).** The AI system is a safety component
  of, or is itself, a product covered by the Union harmonisation legislation in
  Annex I (machinery, medical devices, toys, radio equipment, vehicles, etc.)
  **and** that product must undergo third-party conformity assessment.
- **Route 2 — Annex III use-cases (Art. 6(2)).** The system is intended for one of
  the listed use-cases below.

### Annex III use-case categories

1. **Biometrics** (where permitted): remote biometric identification (excluding
   simple verification "are you who you claim"); biometric categorisation by
   sensitive/protected attributes; emotion recognition.
2. **Critical infrastructure**: safety components in critical digital
   infrastructure, road traffic, or supply of water, gas, heating, electricity.
3. **Education & vocational training**: admissions, evaluating learning outcomes,
   assessing the level of education a person will get, proctoring/monitoring
   prohibited behaviour in tests.
4. **Employment & workers**: recruitment/selection (job-ad targeting, CV
   filtering, candidate evaluation); decisions on promotion/termination, task
   allocation, and performance monitoring.
5. **Access to essential services**: eligibility for public assistance/benefits
   and healthcare; **creditworthiness / credit scoring** (except fraud
   detection); **risk assessment & pricing for life and health insurance**;
   emergency-call triage and dispatch.
6. **Law enforcement** (where permitted): victimisation risk, polygraph-type
   tools, evidence-reliability, offending/re-offending risk, profiling.
7. **Migration, asylum & border control** (where permitted): polygraph-type
   tools, risk assessments, assisting examination of asylum/visa/residence
   applications, person detection/identification (except document verification).
8. **Administration of justice & democratic processes**: assisting a judicial
   authority in researching/interpreting facts and law; influencing the outcome
   of elections/referenda or voting behaviour (except pure campaign logistics).

### The Article 6(3) derogation — when an Annex III system is NOT high-risk

An Annex III system is **not** high-risk if it **does not pose a significant risk
of harm** to health, safety or fundamental rights (does not materially influence
decision outcomes) **and** meets at least one of:

- **(a)** performs a **narrow procedural task**;
- **(b)** **improves the result** of a previously completed human activity;
- **(c)** **detects decision patterns / deviations** without replacing or
  influencing human assessment absent proper human review;
- **(d)** performs a **preparatory task** to a relevant assessment.

**Override:** a system that performs **profiling of natural persons** is **always
high-risk** regardless of (a)–(d). A provider relying on the derogation must
**document the assessment before placing on the market** and **still register**
the system (Art. 6(4) → Art. 49(2)). Treat the derogation as a documented,
case-by-case judgment — never a category-level "off switch."

## 2. Provider obligations (high-risk)

| # | Obligation | What it requires |
| --- | --- | --- |
| Art. 9 | **Risk management system** | Continuous, iterative, lifecycle-long process: identify foreseeable risks (incl. reasonably foreseeable misuse), evaluate, mitigate to acceptable residual risk, test before market. Special attention to minors / vulnerable groups. |
| Art. 10 | **Data & data governance** | Training/validation/test data must be relevant, sufficiently representative, and as far as possible error-free and complete; documented provenance; **examined and mitigated for bias**. May process special-category data strictly for bias correction under safeguards. |
| Art. 11 + Annex IV | **Technical documentation** | Drawn up before market and kept current; must contain the Annex IV elements (system description, development process, monitoring/control, performance metrics, the Art. 9 RMS, standards applied, EU declaration of conformity, post-market plan). SMEs may use a simplified template. |
| Art. 12 | **Record-keeping / logging** | Automatic event logging over the system's lifetime. For remote biometric ID, log usage periods, reference DB, input data on a match, and the persons who verified results. |
| Art. 13 | **Transparency to deployers** | Output interpretable; ship **instructions for use** stating provider identity, capabilities/limitations, accuracy/robustness/cybersecurity levels, human-oversight measures, input specs, expected lifetime, maintenance, and logging. |
| Art. 14 | **Human oversight** | Designed so humans can understand, monitor, resist automation bias, override/disregard, and **stop** the system. Biometric-ID needs **two-person verification** (Art. 14(5)). |
| Art. 15 | **Accuracy, robustness & cybersecurity** | Appropriate, consistent accuracy with declared metrics; resilience to errors and to **data poisoning, model poisoning, adversarial examples, and confidentiality attacks**; guard against feedback loops for learning systems. |
| Art. 17 | **Quality management system** | Written policies/procedures covering compliance strategy, design & testing controls, data management, the Art. 9 RMS, post-market monitoring, incident reporting, record-keeping, accountability. Proportionate to org size. |
| Arts. 43, 47, 48 | **Conformity assessment, EU declaration of conformity, CE marking** | Annex III pt. 1 biometrics may need a notified body (Annex VII) absent full harmonised-standard coverage; pts. 2–8 use internal control (Annex VI). Draw up the EU declaration of conformity (keep 10 years) and affix CE marking. New assessment on substantial modification. |
| Arts. 49 & 71 | **Registration in the EU database** | Register provider + system before market (Annex III, except pt. 2 critical infrastructure which registers nationally). Providers relying on the Art. 6(3) derogation **still register** (Art. 49(2)). |
| Art. 72 | **Post-market monitoring** | Documented system to collect and analyse performance data across the lifetime, per a plan in the technical documentation. |
| Art. 73 | **Serious-incident reporting** | Report serious incidents to the market surveillance authority: no later than **15 days**; **10 days** if a death is involved; **2 days** for widespread infringement or critical-infrastructure disruption. |
| Art. 20 | **Corrective actions** | If a system is non-conforming, immediately correct, withdraw, disable, or recall, and inform distributors, deployers, importers, and the authorised representative. |

## 3. Deployer obligations (Article 26)

- Use **according to the instructions for use**; assign **competent human
  oversight**; ensure **input data** is relevant where the deployer controls it.
- **Monitor** operation; suspend use and notify provider + authority on risk;
  report serious incidents.
- **Keep logs** for at least **six months** (where under the deployer's control).
- **Inform workers / their representatives** before workplace use.
- Public-authority deployers must comply with **Art. 49 registration**.
- Use Art. 13 information to support any **GDPR data-protection impact
  assessment**.
- **Inform affected persons** when a high-risk system makes/assists a decision
  about them.

### Fundamental Rights Impact Assessment — FRIA (Article 27)

Required **before first deployment** by: **public-law bodies and private entities
providing public services**, and **any deployer** of the **credit-scoring
(Annex III 5(b))** and **life/health-insurance risk (Annex III 5(c))** systems.
It covers the deployer's processes, period/frequency of use, affected persons,
specific risks of harm, human-oversight measures, and the mitigations/complaint
mechanisms if risks materialise. Notify the market surveillance authority of the
results; a DPIA can complement it.

## 4. AI literacy (Article 4) — applies to everyone, already in force

Providers and deployers of **any** AI system (not just high-risk) must ensure a
**sufficient level of AI literacy** among staff and others operating systems on
their behalf. In force since **2 February 2025**.

## 5. Standards & the database backbone

- **Harmonised standards (Art. 40)** developed by CEN-CENELEC (JTC 21) give a
  **presumption of conformity** with Arts. 9–15 and 17 — but only once their
  references are **published in the Official Journal**. As of mid-2026 many were
  not yet cited, so do not assume a given standard is citable. The Commission may
  issue **common specifications (Art. 41)** to fill gaps.
- The **EU database (Art. 71)** is the central, largely public registration and
  transparency mechanism for Annex III high-risk systems.

*Primary sources: Articles
[6](https://artificialintelligenceact.eu/article/6/),
[9](https://artificialintelligenceact.eu/article/9/)–[15](https://artificialintelligenceact.eu/article/15/),
[17](https://artificialintelligenceact.eu/article/17/),
[26](https://artificialintelligenceact.eu/article/26/),
[27](https://artificialintelligenceact.eu/article/27/),
[43](https://artificialintelligenceact.eu/article/43/),
[47](https://artificialintelligenceact.eu/article/47/)–[49](https://artificialintelligenceact.eu/article/49/),
[71](https://artificialintelligenceact.eu/article/71/)–[73](https://artificialintelligenceact.eu/article/73/);
[Annex III](https://artificialintelligenceact.eu/annex/3/),
[Annex IV](https://artificialintelligenceact.eu/annex/4/); Commission
[draft high-risk classification guidelines, 19 May 2026](https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems) (draft, in consultation).*
