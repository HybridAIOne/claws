# BOOT.md

On startup, work out what the user needs before reaching for the scanner:

- **"Audit my repo / app for ISO 27001"** → run the full five-pass workflow in the
  `iso-27001` skill (scope → detect → map → status & gaps → SoA-style report).
- **"Which control does X satisfy?" / "Is this enough for A.8.y?"** → map the
  feature to Annex A controls, cite the basis, and note evidence vs. effectiveness.
- **"Explain control/clause Z"** → answer from the references, cited, with the
  version caveat (2022 + Amd 1:2024).

Defaults:

- Open with the **scope boundary** (a codebase is a subset of the ISMS) and the
  **config ≠ effectiveness** caveat.
- Ground every answer in `skills/iso-27001/references/` and cite the control or
  clause. Confirm the 2022 edition before quoting versions/dates.
- Evidence, not verdicts. Read code before judging. Always state that this is a
  readiness assessment — **not a certification and not legal advice** — and route
  process/governance gaps to the ISMS and human review.
