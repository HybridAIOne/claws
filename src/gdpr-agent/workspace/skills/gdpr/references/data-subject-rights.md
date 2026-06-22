# Data-subject rights (Art. 12–22)

## The rights at a glance

| Right | Article | Core of it |
| ----- | ------- | ---------- |
| Information | 13 (from subject), 14 (not from subject) | Tell people what you do at/with collection |
| Access | 15 | A copy of their data + the Art. 15(1) metadata |
| Rectification | 16 | Correct inaccurate / complete incomplete data |
| Erasure ("right to be forgotten") | 17 | Delete when a 17(1) ground applies & no 17(3) exemption |
| Restriction | 18 | "Freeze" processing in defined situations |
| Notification to recipients | 19 | Tell downstream recipients of 16/17/18 actions |
| Portability | 20 | Machine-readable copy of data the subject provided, where processing is by consent/contract **and** automated |
| Objection | 21 | Stop processing based on 6(1)(e)/(f); **absolute** stop for direct marketing |
| Automated decisions | 22 | Right not to be subject to solely-automated decisions with legal/significant effect, with safeguards |

## Deadlines & modalities (Art. 12)

- **Respond within one month** of receipt (Art. 12(3)). Extendable by **two
  further months** for complex or numerous requests — you must inform the subject
  of the extension and why within the first month.
- **Usually free** (Art. 12(5)). For manifestly unfounded or excessive (esp.
  repetitive) requests you may charge a reasonable fee or refuse — and must be able
  to demonstrate why.
- Provide information in a concise, transparent, intelligible, easily accessible
  form, in clear language (Art. 12(1)). Match the channel (e.g. reply
  electronically to an electronic request).

## Identity verification (Art. 12(6))

Verify identity **proportionately** where you have reasonable doubt — do not use it
as a delay tactic, and do not collect more data than needed to verify. The
one-month clock effectively runs from when you can reasonably act on a verified
request.

## Per-right working notes

### Access (Art. 15)
Provide: a copy of the personal data **plus** the purposes, categories of data,
recipients (esp. third countries), retention period (or criteria), the existence of
the other rights, the source (if not from the subject), and whether there is
automated decision-making (with meaningful logic). The copy must not adversely
affect others' rights (Art. 15(4)) — redact third-party personal data.

### Erasure (Art. 17)
Grounds (17(1)): no longer necessary; consent withdrawn (and no other basis);
successful objection; unlawful processing; legal obligation; child's data.
**Exemptions (17(3))**: freedom of expression, legal obligation/public task,
public-health, archiving/research, legal claims. If you erase, **notify recipients**
(Art. 19) and, where the data was made public, take reasonable steps to inform
other controllers (Art. 17(2)).

### Restriction (Art. 18)
Applies while accuracy is contested, processing is unlawful but the subject opposes
erasure, you no longer need the data but the subject needs it for legal claims, or
an Art. 21 objection is pending. Restricted data may only be **stored** (plus
narrow exceptions).

### Portability (Art. 20)
Only for data the subject **provided**, processed by **consent or contract**, and
**by automated means**. Deliver in a structured, commonly used, machine-readable
format (e.g. JSON/CSV); transmit directly to another controller where technically
feasible. Distinct from access — does not cover derived/inferred data.

### Objection (Art. 21)
For processing on 6(1)(e)/(f): stop unless you show compelling legitimate grounds
overriding the subject's, or for legal claims. For **direct marketing** (incl.
related profiling): the objection is **absolute** — stop, no balancing.

### Automated decisions / profiling (Art. 22)
Solely-automated decisions with legal or similarly significant effects are allowed
only if necessary for a contract, authorised by law, or based on explicit consent —
with safeguards: human intervention, the ability to express a view and contest
(Art. 22(3)). Heightened limits for special-category data (Art. 22(4)).

## Controller vs processor

A processor that receives a request must **not** respond directly — it forwards it
to the controller and assists per the DPA (Art. 28(3)(e)). Build this into the DPA.

## Response workflow

1. **Log** receipt: requester, right(s) invoked, date received, one-month due date.
2. **Verify** identity proportionately (Art. 12(6)).
3. **Scope** the request; identify the right(s) and the data/systems in scope.
4. **Check limits/exemptions** for the specific right; redact third-party data.
5. **Compile** the response (categories and copies; minimise free-text PII).
6. **Deliver** within the deadline; if extending, notify within the first month.
7. **Record** the outcome for accountability (Art. 5(2)).

## Response template (skeleton)

```
To: «data subject»
Re: Your request under «Art. 15 / 17 / 20 …», received «date»

We are the controller «controller name» («contact / DPO»).
Outcome: «granted / partially granted / refused», because «reason + article».
[Access] Enclosed: a copy of your personal data and the information required by
Art. 15(1): purposes, categories, recipients, retention, your rights, source,
automated decision-making.
[Refusal/limit] Basis: «exemption + article». You may complain to «supervisory
authority» (Art. 77) or seek a judicial remedy (Art. 78/79).
Completed within one month of receipt «/ extended under Art. 12(3) because …».
```

> Drafts only — confirm exemptions and any refusal with counsel/DPO before sending,
> especially refusals, Art. 9 data, and anything touching third parties.
