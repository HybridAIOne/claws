# Scanner fixtures (synthetic)

These files are **synthetic test inputs** for `eu-ai-act-scan.cjs`. They contain
no real application logic — they exist so the scanner can be validated against a
known mix of EU AI Act signals:

- `chatbot_service.py` — AI/ML framework + model id + a transparency gap (Art. 50).
- `hiring_screener.py` — high-risk employment domain (Annex III §4).
- `training_pipeline.py` — GPAI / fine-tuning signals (Chapter V).

Run:

```bash
node ../../eu-ai-act-scan.cjs --format json scan .
```

Expect hits in `frameworks`, `modelIdentifiers`, `highRiskDomain`, and
`gpaiTraining`, plus a transparency interpretation note. These are heuristic
signals, not a compliance determination.
