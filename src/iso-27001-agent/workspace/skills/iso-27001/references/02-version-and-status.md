# Version & Current Status

*ISO/IEC 27001. Compiled 22 June 2026. Paraphrased, not the standard text. Not
legal/audit advice.* **Read this before discussing editions or dates.**

## Current edition

- **ISO/IEC 27001:2022** is the current edition — the third edition, **published
  25 October 2022**. It **cancelled and replaced ISO/IEC 27001:2013**.
- Full title: *Information security, cybersecurity and privacy protection —
  Information security management systems — Requirements* (the "cybersecurity and
  privacy protection" wording was added in 2022).

## What changed in 2022 (vs 2013)

- **Annex A restructured** to align with **ISO/IEC 27002:2022**: from **114
  controls in 14 domains** down to **93 controls in 4 themes** (Organizational,
  People, Physical, Technological), including **11 new controls** and many merged
  / renamed. See [`03-annex-a-controls.md`](03-annex-a-controls.md).
- **New clause 6.3 "Planning of changes."**
- **Clause 10 reordered:** 10.1 Continual improvement now precedes 10.2
  Nonconformity & corrective action (the reverse of 2013). A common error in
  older material — use the 2022 order.
- Minor wording/terminology updates (e.g. "documented information", explicit ISMS
  process identification in 4.4).

The **clauses 4–10 stayed substantially the same**; the headline change is Annex
A. An organisation's certification scope and obligations are largely unchanged in
substance — the work was re-mapping controls and the Statement of Applicability.

## Most recent development — Amendment 1:2024 (climate)

- **ISO/IEC 27001:2022/Amd 1:2024 — "Climate action changes"**, published
  **February 2024**.
- **Clause 4.1** — the organisation must now **determine whether climate change
  is a relevant issue** to the ISMS (assessed and documented; not automatically
  "relevant" for every organisation).
- **Clause 4.2** — adds a **note** that relevant interested parties can have
  **climate-change-related requirements**.
- The same wording was added across many ISO management-system standards at once.
  Practical impact is usually small for a mature ISMS, but the consideration must
  be **explicitly addressed** (e.g. in the context/risk documentation).

## Transition status (as of 22 June 2026)

- The **2013 → 2022 transition period ended 31 October 2025** (a three-year
  window from the Oct 2022 publication).
- **As of today the deadline has passed:** ISO/IEC 27001:**2013 certificates are
  expired/withdrawn** and no longer valid; **2022 is the only current version**.
  An organisation still on a 2013 certificate would effectively be treated as a
  new client needing a full initial (Stage 1 + Stage 2) audit.
- **Audit implication:** assume any live certificate or new certification effort
  is against **27001:2022 incl. Amd 1:2024**. If a user references "27001:2013",
  flag that it is out of date.

## How an audit should handle versions

1. Treat **27001:2022 (with Amd 1:2024)** as the only current target.
2. If documentation, an SoA, or a control mapping uses the **2013** structure
   (14 domains, A.5–A.18, 114 controls), flag it as outdated and map it to the
   2022 4-theme / 93-control structure.
3. Confirm the **climate-change consideration (4.1/4.2)** is at least addressed
   in the ISMS context.

*Primary sources in [`08-sources.md`](08-sources.md).*
