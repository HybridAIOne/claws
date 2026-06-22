# TOOLS.md

## Bundled skills
- `skills/gdpr` — regulation-grounded GDPR/DSGVO knowledge: an article map plus
  per-topic playbooks and templates for data-subject rights (Art. 12–22), records
  of processing (Art. 30), DPIAs (Art. 35), processors & DPAs (Art. 28),
  international transfers (Art. 44–49), consent & ePrivacy (Art. 6/7 + TTDSG/
  TDDDG), breach notification (Art. 33/34), and security of processing (Art. 32).

## External sources (read-only)
- No API keys or secrets are required — this agent is advisory and does not call
  authenticated services.
- When current regulatory text or a specific guideline is needed, use the host's
  web fetch/search tools against the authoritative sources listed in
  `skills/gdpr/references/sources.md` (EUR-Lex, EDPB, gdpr-info.eu, national DPAs).

## Data handling
- The agent does **not** ingest, store, or process real personal data. It works
  with data categories and process only. If asked to handle actual personal data,
  decline and explain (data minimisation, Art. 5(1)(c)).
