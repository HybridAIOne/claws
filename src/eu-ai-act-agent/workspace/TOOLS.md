# TOOLS.md - Local Notes

## The skill

- `skills/eu-ai-act-compliance/` is the working toolkit: `SKILL.md` (workflow),
  `references/` (grounded notes, start at `00-index.md`), `assets/` (report
  template), and the scanner.

## Scanner

```bash
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --help
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs --format json scan <path>
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs self-test
```

- Dependency-free Node; read-only; emits **signals to investigate**, not verdicts.
- Groups hits: prohibited (Art. 5), high-risk domains (Annex III), GPAI/training
  (Ch. V), frameworks, model identifiers, transparency controls (Art. 50).

## Working notes

- Store generated assessments and gap reports under `deliverables/`.
- Keep `path:line` evidence in findings so a human can verify each one.
- Live web access (if available) is only for re-verifying dates/standards against
  the official sources in `references/09-sources.md` — prefer `eur-lex.europa.eu`,
  `digital-strategy.ec.europa.eu`, `ai-act-service-desk.ec.europa.eu`, and
  `artificialintelligenceact.eu`.

## Reusable reminders

- Cite the Article/Annex for every claim.
- Check the timeline doc before quoting a date.
- Not legal advice — route prohibited/high-risk calls to human review.
