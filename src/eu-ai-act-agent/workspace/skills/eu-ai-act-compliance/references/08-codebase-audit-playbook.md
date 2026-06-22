# Codebase / App Audit Playbook

*The method the agent follows to assess a repository or application against the
EU AI Act. Compiled 22 June 2026. Not legal advice — produces signals and a
structured gap analysis for human review.*

Work in five passes. Don't skip the scoping passes (1–3): a wrong role or tier
classification invalidates everything after it.

## Pass 1 — Detect AI usage

Find where AI/ML actually lives. Use the bundled scanner as a first sweep, then
confirm by reading code:

```bash
node skills/eu-ai-act-compliance/eu-ai-act-scan.cjs scan <path-to-repo>
```

It greps for, and you should also look for:

- **Hosted LLM / model SDKs:** `openai`, `anthropic`, `@anthropic-ai`,
  `google-generativeai` / `google-genai`, `cohere`, `mistralai`, `huggingface`,
  `replicate`, `langchain`, `llamaindex`, Azure/Bedrock/Vertex AI SDKs.
- **Local / training stacks:** `torch`, `tensorflow`, `transformers`, `keras`,
  `scikit-learn`, `xgboost`, `onnxruntime`, `vllm`, `llama.cpp`.
- **Model identifiers & calls:** `claude-*`, `gpt-*`, `gemini-*`, `.predict(`,
  `.generate(`, `chat.completions`, `embeddings`, inference endpoints.
- **Modalities:** image/audio/video generation, speech-to-text, face/voice
  processing, recommendation/ranking, scoring/classification.

If no AI system or GPAI model is present, say so — the Act largely does not
apply (mind the Art. 3 definition; learned models count, plain rules usually
don't). See [`01-scope-and-definitions.md`](01-scope-and-definitions.md).

## Pass 2 — Determine the role(s)

For each AI feature, decide whether the user is **provider**, **deployer**,
**importer/distributor**, or several (Art. 3; see
[`01-scope-and-definitions.md`](01-scope-and-definitions.md)). Heuristics:

- Calls a third-party hosted model under that vendor's name → **deployer** of an
  AI system (and downstream user of a GPAI model).
- Trains / fine-tunes / ships a model under the user's own name/brand →
  **provider** (possibly a GPAI-model provider — see
  [`05-gpai-models.md`](05-gpai-models.md)).
- Substantially modifies, rebrands, or repurposes a high-risk system → may
  **become a provider** (Art. 25).

Also check **scope**: is output used in the EU / are EU users served (Art. 2)?
Are any **exclusions** (R&D, military, purely personal) genuinely met?

## Pass 3 — Classify the risk tier (the decision tree)

Walk the tiers top-down and stop at the highest that matches:

1. **Prohibited (Art. 5)?** Manipulation, vulnerability exploitation, social
   scoring, profiling-only crime prediction, face-scraping, workplace/education
   emotion recognition, sensitive-attribute biometric categorisation, real-time
   public RBI. → If yes, **STOP and flag as the top finding.** See
   [`03-prohibited-practices.md`](03-prohibited-practices.md).
2. **High-risk (Art. 6 + Annex III / Annex I)?** Biometrics, critical
   infrastructure, education, employment/HR, essential services (credit,
   insurance, benefits), law enforcement, migration, justice — or a safety
   component of an Annex I product. Apply the **Art. 6(3) derogation** test
   (documented, case-by-case; profiling is always high-risk). See
   [`04-high-risk-systems.md`](04-high-risk-systems.md).
3. **Transparency / limited risk (Art. 50)?** Chatbots, generative content, deep
   fakes, emotion recognition. Almost every generative-AI app lands here. See
   [`06-transparency-obligations.md`](06-transparency-obligations.md).
4. **GPAI model (Ch. V)?** Independent of the above — does the user train/ship a
   general-purpose model? Check the 10²⁵ FLOP systemic-risk threshold. See
   [`05-gpai-models.md`](05-gpai-models.md).
5. **Minimal risk?** Everything else — no specific obligations beyond **AI
   literacy (Art. 4)** and good practice.

A system can sit in several buckets at once (e.g. a high-risk hiring tool that is
also a chatbot owes both Art. 9–17 and Art. 50). Record every applicable tier.

## Pass 4 — Map obligations and find gaps

For each applicable tier, walk its obligation list and look for **concrete
evidence** in the repo of each control — or its absence. Examples of what to grep
for and read:

- **Logging / record-keeping (Art. 12, 26(6)):** structured audit logs of model
  inputs/outputs/decisions, retention config (≥6 months for deployers).
- **Human oversight (Art. 14):** override/stop controls, human-in-the-loop steps,
  confirmation gates before automated decisions take effect.
- **Transparency (Art. 13, 50):** "you're talking to an AI" notices; instructions
  for use / model cards; provenance/watermark on generated media.
- **Data governance (Art. 10):** dataset documentation, provenance, bias
  testing/evaluation, data-quality checks.
- **Technical documentation (Art. 11 + Annex IV):** model cards, system
  descriptions, eval reports, a risk-management record.
- **Accuracy/robustness/security (Art. 15):** eval suites, adversarial/red-team
  tests, input validation, abuse/rate limiting, secrets handling.
- **Risk & quality management (Art. 9, 17):** a risk register, a QMS or
  equivalent policy set, change-management for model updates.
- **Registration & conformity (Art. 43, 47–49, 71):** for high-risk providers,
  evidence of conformity assessment, EU declaration of conformity, CE marking,
  EU-database registration.
- **GPAI (Art. 53):** copyright/TDM-opt-out policy, training-content summary,
  downstream documentation.

Mark each obligation **Met / Partial / Missing / N-A / Needs-legal-review**, with
the file evidence (`path:line`) or a note that it is an organisational control
outside the repo.

## Pass 5 — Report

Produce the structured report using
[`assets/compliance-report-template.md`](../assets/compliance-report-template.md):
executive summary, system inventory, role + tier classification with reasoning,
the obligation gap table, a prioritised remediation plan (tie each gap to its
Article and fine tier), and the standing **not-legal-advice** disclaimer plus the
applicable **dates** (note the pending Digital Omnibus where relevant).

## Guardrails for the agent

- **Signals, not verdicts.** Code reveals *use*, not legal *purpose*, *context*,
  or *harm*. State findings as "likely / investigate," reserve "violation" for
  clear Art. 5 matches, and route classification calls to a human.
- **Cite the provision** for every obligation and finding.
- **Be honest about uncertainty** and about the moving timeline.
- **Never fabricate** an Article number, a date, or a standard. If unsure, check
  [`09-sources.md`](09-sources.md) or say you don't know.
