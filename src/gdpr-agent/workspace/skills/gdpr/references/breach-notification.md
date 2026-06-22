# Personal-data breach (Art. 33/34)

A **personal-data breach** (Art. 4(12)) is a breach of security leading to
accidental or unlawful destruction, loss, alteration, unauthorised disclosure of,
or access to personal data — confidentiality, integrity, **or** availability. A
ransomware lockout or accidental deletion counts even with no exfiltration.

## The 72-hour workflow

1. **Detect & open the clock.** "Awareness" (Art. 33(1)) = reasonable degree of
   certainty a breach occurred. The **72-hour** deadline to notify the authority
   runs from there. Record the awareness timestamp.
2. **Contain & investigate.** Stop the bleeding; preserve evidence; establish what
   data, whose, how much, and the cause.
3. **Assess risk to individuals** (likelihood × severity of harm): identity theft,
   fraud, financial loss, discrimination, reputational damage, loss of
   confidentiality of special-category data, etc. Factors: data type & volume,
   ease of identification, whether data was **encrypted/pseudonymised**, number of
   people, special-category involvement.
4. **Notify the supervisory authority (Art. 33)** within 72 h **unless** the breach
   is *unlikely to result in a risk* to individuals. If you miss 72 h, notify
   anyway **with reasons for the delay** (Art. 33(1)). Notification may be phased
   (Art. 33(4)) as facts emerge.
5. **Communicate to affected individuals (Art. 34)** **without undue delay** when
   the breach is likely to result in **high risk**. Exceptions (Art. 34(3)): data
   was unintelligible (e.g. strong encryption), risk since mitigated, or it would
   require disproportionate effort (then a public communication instead).
6. **Log every breach** in the internal **breach register** regardless of whether
   you notified (Art. 33(5)) — facts, effects, remedial action. This is mandatory
   accountability evidence.

## Processor duty

A **processor** must notify its **controller without undue delay** after becoming
aware (Art. 33(2)) — the DPA should set a tight internal deadline so the controller
can still meet its 72 h.

## What the authority notification must contain (Art. 33(3))

- nature of the breach; categories & approximate number of data subjects and of
  records;
- name & contact of the DPO / contact point;
- likely consequences;
- measures taken or proposed to address it and mitigate harm.

## Breach register entry (template)

```
Breach ID: «…»            Awareness (date/time): «…»   72h deadline: «…»
What happened / cause: «…»
Data categories & subjects affected (approx #): «…»   Special category? «y/n»
Encrypted/pseudonymised? «y/n»
Risk assessment: likelihood «L/M/H» × severity «L/M/H» → overall «…»
Authority notified? «y/n + when + ref»  (if no: reason)
Individuals notified (Art. 34)? «y/n + when + how»  (if no: Art. 34(3) reason)
Remedial & preventive actions: «…»     Owner: «…»     Closed: «date»
```

> The "risk" and "high risk" thresholds are judgement calls with legal
> consequences and a hard clock. For any real breach, escalate to the DPO/counsel
> immediately and in parallel — do not let analysis consume the 72 hours.
