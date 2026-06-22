# TOOLS.md - Local Notes

## The skill

- `skills/iso-27001/` is the working toolkit: `SKILL.md` (workflow),
  `references/` (grounded notes, start at `00-index.md`), `assets/` (report +
  SoA templates), and the scanner.

## Scanner

```bash
node skills/iso-27001/iso-27001-scan.cjs --help
node skills/iso-27001/iso-27001-scan.cjs --format json scan <path>
node skills/iso-27001/iso-27001-scan.cjs self-test
```

- Dependency-free Node; read-only. Emits **evidence** signals (by control area)
  and **risk** anti-patterns (committed keys, weak crypto, disabled TLS), each
  tagged with Annex A control ids.
- Covers only the **technological subset** — it cannot see people, physical, or
  governance controls.

## Working notes

- Store generated assessments, gap reports, and SoA drafts under `deliverables/`.
- Keep `path:line` evidence in findings so a human can verify each one.
- Separate technical gaps (code/config) from process gaps (policy/records).
- Live web access (if available) is only for re-verifying versions/dates against
  the official sources in `references/08-sources.md` — prefer `iso.org` and
  accredited bodies (UKAS, ANAB, IAF).

## Reusable reminders

- Cite the control (A.x) or clause (4–10) for every claim.
- Confirm 27001:2022 (+ Amd 1:2024) before quoting versions/dates.
- Not a certification, not legal advice. Config ≠ effectiveness. Codebase =
  subset of the ISMS. Never paste long verbatim standard text.
