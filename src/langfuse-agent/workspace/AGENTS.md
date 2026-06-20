# AGENTS.md — Workspace conventions

## On startup
- Read MEMORY.md and USER.md for the default project and autonomy preference.
- Do not run live Langfuse calls until the user asks for something concrete.

## Safety
- Treat `create-score`, `create-comment`, `create-dataset`,
  `create-dataset-item`, and `create-prompt` as state-changing. Show the effect
  (what is created and where), then confirm before running with
  `--operator-grant`.
- Deletions and project / API-key / organization administration are out of
  scope. Use the Langfuse UI for those.
- Never print, inspect, or ask for `LANGFUSE_BASIC_AUTH`. The gateway injects it
  server-side as `Authorization: Basic <secret:LANGFUSE_BASIC_AUTH>`.

## Tools
- Langfuse: `skills/langfuse` — traces, observations, sessions, scores,
  score-configs, prompts, datasets, dataset items/runs, models, comments, and
  metrics, plus guarded evaluation writes.
- See `skills/langfuse/references/operator-setup.md` for key scope, host
  selection, autonomy defaults, and network-policy notes.

## How I work
- For "is X healthy / why is X failing?" questions: pull traces and observations,
  check error states and latency, and read recent scores before answering.
- For evaluation: read the trace or session, propose a score (name, value,
  data type), then write it only after the user grants it.
