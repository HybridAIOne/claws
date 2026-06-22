# International transfers (Art. 44–49)

A "transfer" is making personal data available to a recipient in a **third country**
(outside the EEA) or an international organisation — including remote access and
storage on non-EEA infrastructure. Every transfer needs both a normal Art. 6 basis
**and** a Chapter V transfer mechanism (Art. 44).

## The mechanisms, in order of preference

1. **Adequacy decision (Art. 45)** — the Commission has ruled the country ensures
   adequate protection (e.g. UK, Switzerland, Japan, South Korea, Canada
   (commercial), and others). No extra safeguard needed for covered transfers.
2. **EU–US Data Privacy Framework (adequacy, July 2023)** — transfers to a US
   organisation **self-certified** under the DPF are covered by an adequacy
   decision. Check the recipient is currently on the DPF list for the relevant
   data type; if not, treat it as a normal third-country transfer (use SCCs).
3. **Appropriate safeguards (Art. 46)** — most commonly the **Standard
   Contractual Clauses (SCCs)** (2021 modules: C2C, C2P, P2P, P2C). Also BCRs
   (Art. 47) for intra-group, approved codes/certifications.
4. **Derogations (Art. 49)** — narrow, case-by-case, not for repetitive/large
   transfers: explicit consent, contract necessity, important public interest,
   legal claims, vital interests. Treat as a last resort.

## Schrems II → Transfer Impact Assessment (TIA)

For Art. 46 transfers (SCCs/BCRs) you must assess whether the destination's law
undermines the safeguards (CJEU *Schrems II*, C-311/18) and add **supplementary
measures** where needed:
- map the transfer (data, parties, country, onward transfers);
- assess the third country's surveillance/access laws vs the SCCs;
- add technical measures (strong **encryption** with EU-held keys,
  pseudonymisation), contractual and organisational measures;
- conclude and **document**; re-assess on change. Document the TIA — it is part of
  accountability.

## Practical checklist

- [ ] Is there a transfer at all? (non-EEA recipient, access, or hosting)
- [ ] Adequacy or DPF covers it? → done (record it; verify DPF certification).
- [ ] Otherwise SCCs (correct module) signed + TIA completed + supplementary
      measures where needed.
- [ ] Onward transfers (sub-processors) covered by equivalent safeguards.
- [ ] Transfer + mechanism recorded in the ROPA (Art. 30(1)(e)) and disclosed in
      the privacy notice (Art. 13(1)(f)/14(1)(f)).

> Transfer legality is fact- and country-specific and shifts with new adequacy
> decisions and case law. Confirm the current mechanism and any TIA conclusion with
> counsel/DPO; verify DPF status and adequacy lists against the primary sources in
> [sources.md](sources.md).
