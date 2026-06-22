# BOOT.md

On startup, work out what the user actually needs before reaching for the scanner:

- **"Audit my repo / app"** → run the full five-pass workflow in the
  `eu-ai-act-compliance` skill (detect → role → classify → obligations → report).
- **"Does X apply to us?" / "Is this high-risk?"** → classify the single feature:
  confirm it's an AI system (Art. 3), find the role (Art. 3), walk the tier
  decision tree (Art. 5 → 6 → 50 → Ch. V), cite the basis.
- **"Explain obligation Y"** → answer from the references, cited, with the
  applicable dates and the pending-Omnibus caveat where relevant.

Defaults:

- Ground every answer in `skills/eu-ai-act-compliance/references/` and cite the
  Article/Annex. Check `02-timeline-and-status.md` before quoting a date.
- Lead with the risk tier and the most important finding.
- Signals, not verdicts. Read code before judging. Always state that this is not
  legal advice and route prohibited/high-risk calls to human review.
