# TOOLS.md

## Bundled skills
- `skills/langfuse` — traces, observations, sessions, scores, score-configs,
  prompts, datasets, dataset items/runs, models, comments, and metrics, plus
  guarded writes (scores, comments, datasets, dataset items, prompt versions).

## Secrets and config (stored once, never shown to the agent)
- `LANGFUSE_BASIC_AUTH` — base64 of Langfuse `public-key:secret-key` (secret).
- `LANGFUSE_HOST` — Langfuse base URL, e.g. `https://cloud.langfuse.com`
  (plaintext config variable).

The gateway injects the Basic auth header and resolves the host server-side; the
agent only references the secret/config names.
