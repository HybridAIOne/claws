# Processors & Data Processing Agreements (Art. 28)

When one party processes personal data **on behalf of** another, the controller
must use only processors giving **sufficient guarantees** (Art. 28(1)), and the
relationship must be governed by a contract — the **DPA** (German: *Auftrags­
verarbeitungsvertrag, AVV*) — with the mandatory contents of Art. 28(3).

## Mandatory DPA contents (Art. 28(3))

The processor must be bound to:
- (a) process **only on documented instructions** from the controller (incl. for
  transfers), unless required by law;
- (b) ensure persons authorised to process are under a **duty of confidentiality**;
- (c) take all **Art. 32 security** measures;
- (d) respect the conditions for engaging **sub-processors** (Art. 28(2)/(4));
- (e) **assist** the controller in responding to **data-subject requests**
  (Art. 12–22);
- (f) **assist** with security, breach notification (Art. 33/34), DPIAs (Art. 35)
  and prior consultation (Art. 36);
- (g) **delete or return** all personal data at the end of the service (and delete
  copies, unless retention is legally required);
- (h) make available the information needed to demonstrate compliance and **allow
  and contribute to audits/inspections**.
The contract must also set out the subject-matter, duration, nature & purpose,
type of personal data, and categories of data subjects (Art. 28(3) chapeau).

## Sub-processors (Art. 28(2), (4))

A processor needs the controller's **prior authorisation** to engage a
sub-processor — specific or general. With *general* written authorisation, the
processor must inform the controller of intended changes and give it a chance to
**object** (Art. 28(2)). The same Art. 28(3) obligations must **flow down** to each
sub-processor by contract (Art. 28(4)); the original processor stays fully liable.

## Maintain a sub-processor list (controller view)

Keep a current register of every processor/sub-processor that touches personal
data, what they do, where they are, and the safeguard for any transfer. It feeds
the ROPA, the privacy notice, and customer DPAs.

```
Sub-processor | Service / data | Location | Transfer mechanism | DPA in place? | Reviewed
------------- | -------------- | -------- | ------------------ | ------------- | --------
«vendor»      | «email/PII»    | «EU/US»  | «adequacy/SCCs/—»  | «y/n + date»  | «date»
```

## Controller ↔ processor checklist

- [ ] Role correctly identified (a vendor can be processor for some data, an
      independent controller for other data, or a joint controller — Art. 26).
- [ ] Signed DPA/AVV with all Art. 28(3) clauses (and Art. 28(3) chapeau details).
- [ ] Sub-processor authorisation model agreed (specific vs general + objection).
- [ ] Art. 32 measures specified (often a TOMs annex).
- [ ] International-transfer terms where the processor/sub-processor is outside the
      EEA — see [international-transfers.md](international-transfers.md).
- [ ] Breach-notification timing from processor to controller (often << 72 h so the
      controller can still meet Art. 33).
- [ ] Deletion/return terms at end of contract.

> A DPA is a binding contract — have counsel review wording, liability, and
> sub-processor terms before signing. This reference checks completeness, not legal
> sufficiency.
