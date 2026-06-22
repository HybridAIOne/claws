# GDPR / DSGVO — Regulation map

A compact, citable map of Regulation (EU) 2016/679 (GDPR; German: DSGVO), in force
since **25 May 2018**, plus the German specifics. Use it to find the right article
fast; go to the topic reference for the working playbook, and to the primary source
([sources.md](sources.md)) when exact wording matters.

## Key definitions (Art. 4)

- **Personal data** (Art. 4(1)) — any information relating to an identified or
  identifiable natural person ("data subject"); includes online identifiers, IP
  addresses, cookie IDs where they can single someone out.
- **Processing** (Art. 4(2)) — virtually any operation on personal data
  (collection, storage, use, disclosure, erasure…).
- **Controller** (Art. 4(7)) — decides the purposes and means of processing.
- **Processor** (Art. 4(8)) — processes on behalf of a controller.
- **Pseudonymisation** (Art. 4(5)) vs anonymisation — pseudonymous data is still
  personal data; truly anonymous data is outside the GDPR (Recital 26).
- **Personal-data breach** (Art. 4(12)) — a breach of security leading to
  destruction, loss, alteration, unauthorised disclosure of, or access to personal
  data.

## Territorial scope (Art. 3)

Applies to processing by an EU establishment (Art. 3(1)), **and** to non-EU
controllers/processors offering goods/services to, or monitoring the behaviour of,
people in the EU (Art. 3(2)) — the "extra-territorial" reach.

## Principles (Art. 5)

1. Lawfulness, fairness, transparency — 5(1)(a)
2. Purpose limitation — 5(1)(b)
3. Data minimisation — 5(1)(c)
4. Accuracy — 5(1)(d)
5. Storage limitation — 5(1)(e)
6. Integrity & confidentiality (security) — 5(1)(f)
7. **Accountability** — 5(2): the controller must be able to *demonstrate*
   compliance.

## Lawful bases (Art. 6(1))

(a) consent · (b) performance of a contract · (c) legal obligation · (d) vital
interests · (e) public task · (f) legitimate interests (balancing test;
not available to public authorities in their tasks). Choose and document the basis
*before* processing; you cannot silently swap bases later.

## Special-category data (Art. 9)

Processing is **prohibited** unless an Art. 9(2) exception applies (e.g. explicit
consent, employment/social-security law, vital interests, manifestly public,
legal claims, substantial public interest, health/medicine, public health,
archiving/research). Categories: racial/ethnic origin, political opinions,
religious/philosophical beliefs, trade-union membership, genetic data, biometric
data for unique identification, health, sex life, sexual orientation. Criminal
convictions/offences have their own regime (Art. 10).

## Transparency & rights (Art. 12–22)

- 12 — transparent information, modalities, **one-month** response, usually free.
- 13/14 — information to provide (data collected from / not from the subject).
- 15 access · 16 rectification · 17 erasure · 18 restriction · 19 notification of
  recipients · 20 portability · 21 objection · 22 automated decisions/profiling.
See [data-subject-rights.md](data-subject-rights.md).

## Controller & processor duties (Art. 24–43)

- 24 controller responsibility · 25 **data protection by design & by default** ·
  26 joint controllers · 27 EU representative (for Art. 3(2) cases) · 28 processors
  + DPA ([processors-and-dpa.md](processors-and-dpa.md)) · 29 processing under
  authority · 30 **ROPA** ([ropa.md](ropa.md)) · 32 **security**
  ([security-of-processing.md](security-of-processing.md)) · 33/34 **breach**
  ([breach-notification.md](breach-notification.md)) · 35/36 **DPIA** + prior
  consultation ([dpia.md](dpia.md)) · 37–39 **DPO** · 40–43 codes & certification.

## Transfers outside the EEA (Art. 44–49)

44 general principle · 45 adequacy decisions · 46 appropriate safeguards (incl.
**SCCs**) · 47 binding corporate rules · 49 derogations. See
[international-transfers.md](international-transfers.md).

## Supervisory authorities, remedies, fines

- One-stop-shop / lead authority for cross-border processing (Art. 56); EDPB
  consistency (Art. 63–67).
- Remedies: complaint to an authority (Art. 77), judicial remedy (Art. 78/79),
  compensation (Art. 82).
- **Fines (Art. 83)** — two tiers: up to **€10m or 2%** of total worldwide annual
  turnover (lower tier, e.g. Art. 8, 11, 25–39, 42, 43), and up to **€20m or 4%**
  (higher tier, e.g. principles Art. 5/6/9, rights Art. 12–22, transfers
  Art. 44–49). Whichever is higher.

## German specifics (DSGVO context)

- **BDSG** (Bundesdatenschutzgesetz) — national law filling GDPR opening clauses
  (employee data §26, video surveillance, etc.).
- **DPO threshold (BDSG §38)** — beyond the GDPR Art. 37 triggers, German law also
  requires a DPO where **≥20 persons are constantly engaged** in automated
  processing of personal data (plus where a DPIA is required or where data is
  processed commercially for transfer/market research).
- **Cookies / online tracking — TTDSG, renamed TDDDG (Dec 2024), §25**: storing or
  reading information on a user's device needs prior **opt-in consent** unless
  strictly necessary for a service the user explicitly requested. This is separate
  from, and additional to, the GDPR lawful basis. See
  [consent-and-eprivacy.md](consent-and-eprivacy.md).
- **Supervisory authorities are per-Bundesland** for the private sector (e.g. the
  competent authority depends on the company's place of establishment); the BfDI is
  the federal authority (public-sector/telecoms).

## How to cite

Use article + paragraph + point, e.g. `Art. 6(1)(f)`, `Art. 17(1)(a)`,
`Art. 33(1)`. Recitals (e.g. Recital 26 on anonymisation, Recital 32 on consent)
explain intent but are not themselves binding articles — cite them as context.
