# Records of Processing Activities — ROPA (Art. 30)

The ROPA (German: *Verzeichnis von Verarbeitungstätigkeiten*) is the backbone of
accountability: a written (electronic is fine) inventory of what you do with
personal data. Authorities routinely ask for it first.

## Who must keep one

Both **controllers** (Art. 30(1)) and **processors** (Art. 30(2)) must, with
different fields. The **<250-employee exemption** (Art. 30(5)) is narrow — it does
**not** apply if processing is *likely to result in a risk*, is *not occasional*,
or includes *special-category data (Art. 9)* or criminal-conviction data
(Art. 10). In practice almost any ongoing SaaS, and anything touching Art. 9 data,
must keep a ROPA regardless of headcount.

## Controller ROPA fields (Art. 30(1))

- (a) name & contact of controller (joint controllers, representative, DPO)
- (b) purposes of the processing
- (c) categories of data subjects and of personal data
- (d) categories of recipients (incl. in third countries / international orgs)
- (e) transfers to a third country + the safeguard used (Art. 46) where applicable
- (f) envisaged **retention/erasure** time limits (where possible)
- (g) general description of the **technical & organisational security measures**
  (Art. 32) — where possible

## Processor ROPA fields (Art. 30(2))

- name & contact of processor(s), each controller it acts for, representative, DPO
- categories of processing carried out for each controller
- third-country transfers + safeguards
- general description of the Art. 32 security measures

## How to build it

1. Enumerate **processing activities** (by purpose/business process, not by table):
   e.g. "user account management", "billing", "product analytics", "customer survey
   hosting", "support".
2. For each, fill the Art. 30 fields. Tie each to a **lawful basis** (Art. 6; and
   an Art. 9(2) condition if special-category) — strictly an Art. 6/13/14 record,
   but keeping it in the ROPA is good practice.
3. Note the **role** (controller vs processor) per activity — a SaaS is often
   controller for its own users and processor for customer-uploaded data.
4. Keep it **current**: review on schema/vendor/purpose change and at least
   annually.

## Template (one activity)

```
Activity: «name»                         Role: «controller | processor»
Purpose(s): «…»                          Lawful basis: «Art. 6(1)(…)» [+ «Art. 9(2)(…)»]
Data subjects: «categories»              Personal-data categories: «…»  Special category? «y/n»
Recipients: «internal teams; processors; third countries»
Transfers outside EEA: «country» via «adequacy | SCCs | BCR | derogation»
Retention: «period or criteria»          Source (if not from subject): «…»
Security (Art. 32): «encryption, access control, logging, backups, …»  → see TOMs
Last reviewed: «date»                    Owner: «role»
```

> The ROPA feeds the DPIA screening, the privacy notice (Art. 13/14), the
> sub-processor list, and the retention schedule — keep them consistent.
