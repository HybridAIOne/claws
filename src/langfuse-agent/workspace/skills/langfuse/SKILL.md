---
name: langfuse
description: "Read Langfuse traces, observations, sessions, scores, prompts, datasets, models, and metrics, and create scores, comments, datasets, dataset items, and prompt versions through gateway-proxied API requests."
user-invocable: true
requires:
  bins:
    - node
credentials:
  - id: langfuse-basic-auth
    kind: header
    required: true
    secret_ref:
      source: store
      id: LANGFUSE_BASIC_AUTH
    scope: "Langfuse public API Authorization Basic header secret for <LANGFUSE_HOST>/api/public"
    how_to_obtain: |
      In Langfuse, open Project Settings → API Keys and create a key pair
      (public key `pk-lf-...` and secret key `sk-lf-...`). Locally base64-encode
      `public-key:secret-key` and store only that encoded credential in chat with
      `/secret set LANGFUSE_BASIC_AUTH "<base64-public-colon-secret>"`.
      Use a read-only or project-scoped key for analysis; only the same key is
      needed to write scores, comments, datasets, or prompt versions.
config_variables:
  - id: langfuse-host
    env: LANGFUSE_HOST
    required: true
    scope: "Langfuse API base URL used in <LANGFUSE_HOST>/api/public"
    how_to_obtain: |
      Use your Langfuse deployment base URL: `https://cloud.langfuse.com` for
      Langfuse Cloud EU, `https://us.cloud.langfuse.com` for Langfuse Cloud US,
      or your self-hosted origin. Store it in chat with
      `/env set LANGFUSE_HOST https://cloud.langfuse.com`.
metadata:
  hybridclaw:
    category: observability
    short_description: "Langfuse LLM observability: traces, scores, prompts, datasets, metrics, and guarded evaluation writes."
    tags:
      - langfuse
      - observability
      - llm
      - evaluation
      - tracing
      - prompts
    stakes_tiers:
      green:
        - health
        - get-project
        - list-traces
        - get-trace
        - list-observations
        - get-observation
        - list-sessions
        - get-session
        - list-scores
        - get-score
        - list-score-configs
        - get-score-config
        - list-prompts
        - get-prompt
        - list-datasets
        - get-dataset
        - list-dataset-items
        - get-dataset-item
        - list-dataset-runs
        - get-dataset-run
        - list-models
        - get-model
        - list-comments
        - get-comment
        - metrics
      amber:
        - create-score
        - create-comment
        - create-dataset
        - create-dataset-item
        - create-prompt
    escalation:
      writes: confirm-each
      route: f14
    cost_measurement:
      system: UsageTotals
      sub_limit_key: langfuse
---

# Langfuse

Use this skill for Langfuse LLM observability and evaluation work: inspect
traces, observations, sessions, and scores; query metrics; read prompts and
datasets; and — after explicit operator approval — record scores, comments,
dataset items, and new prompt versions.

## Setup

The helper never sees credentials. The gateway injects them server-side from two
stored values:

1. `LANGFUSE_BASIC_AUTH` — base64 of `public-key:secret-key`. Store it in chat
   with `/secret set LANGFUSE_BASIC_AUTH "<base64-public-colon-secret>"`.
2. `LANGFUSE_HOST` — your Langfuse base URL. Store it in chat with
   `/env set LANGFUSE_HOST https://cloud.langfuse.com` (use
   `https://us.cloud.langfuse.com` for US, or your self-hosted origin).

Local-terminal alternative: `hybridclaw secret set LANGFUSE_BASIC_AUTH "<...>"`
and `hybridclaw env set LANGFUSE_HOST https://cloud.langfuse.com`.

See [references/operator-setup.md](references/operator-setup.md) for key scope,
host selection, autonomy defaults, and network-policy notes.

## Default Workflow

1. Start read-only: list traces, observations, sessions, scores, prompts, and
   datasets, or query `metrics`.
2. Use `plan` for natural-language requests before building any write request.
3. Treat `langfuse.cjs` as the API wrapper. Do not handcraft Langfuse API URLs,
   JSON bodies, tiers, host, or the Basic auth header from memory.
4. For prompt/user testing, stop after `plan` or after helper `http-request`
   payload generation. Do not call helper `run` or the built-in `http_request`
   tool.
5. For real user requests that need live Langfuse data, use helper `run`. The
   helper constructs the request, sends it through the HybridClaw gateway, and
   the gateway resolves `Authorization: Basic <secret:LANGFUSE_BASIC_AUTH>` and
   the `<env:LANGFUSE_HOST>` base URL server-side. Do not rewrite the secret
   placeholder, preflight it, inspect it, or ask the model for the keys.
6. Use `http-request` only when you need to inspect the generated gateway
   payload or when the active runtime cannot give the helper gateway access.
7. If a live call returns 401 or 403, stop after that first failure. Do not
   retry or fan out to more endpoints; ask the operator to set or verify
   `LANGFUSE_BASIC_AUTH` and `LANGFUSE_HOST`.
8. Require an explicit operator grant before any write (`create-score`,
   `create-comment`, `create-dataset`, `create-dataset-item`, `create-prompt`).
   Pass `--operator-grant` only after that grant.

## Command Contract

Run the helper:

```bash
node skills/langfuse/langfuse.cjs --help
```

Plan a request without contacting Langfuse:

```bash
node skills/langfuse/langfuse.cjs --format json plan "Average eval score this week"
```

Run live read requests:

```bash
node skills/langfuse/langfuse.cjs --format json run list-traces --user-id alice --limit 50
node skills/langfuse/langfuse.cjs --format json run get-trace --trace-id abc123
node skills/langfuse/langfuse.cjs --format json run list-observations --type GENERATION
node skills/langfuse/langfuse.cjs --format json run list-scores --name quality
node skills/langfuse/langfuse.cjs --format json run get-prompt --prompt-name support-reply --label production
node skills/langfuse/langfuse.cjs --format json run metrics --query '{"view":"traces","metrics":[{"measure":"count","aggregation":"count"}]}'
```

Run guarded live write requests (only after an explicit operator grant):

```bash
node skills/langfuse/langfuse.cjs --format json run create-score \
  --trace-id abc123 --name quality --value 0.8 --data-type NUMERIC \
  --comment "reviewed" --operator-grant

node skills/langfuse/langfuse.cjs --format json run create-dataset-item \
  --dataset-name regressions --input-json '{"q":"..."}' \
  --expected-output-json '{"a":"..."}' --source-trace-id abc123 --operator-grant

node skills/langfuse/langfuse.cjs --format json run create-prompt \
  --name summarizer --type text --prompt "Summarize: {{input}}" \
  --label production --commit-message "tighten instructions" --operator-grant
```

Build a dry-run gateway payload without calling Langfuse:

```bash
node skills/langfuse/langfuse.cjs --format json http-request list-traces --user-id alice
```

Select region or self-hosted host explicitly (otherwise `<env:LANGFUSE_HOST>`):

```bash
node skills/langfuse/langfuse.cjs --format json run list-traces --host https://us.cloud.langfuse.com
```

## Working Rules

- Treat `create-score`, `create-comment`, `create-dataset`,
  `create-dataset-item`, and `create-prompt` as state-changing. Produce an
  approval plan, wait for the operator's grant, then run the exact approved
  helper command with `--operator-grant`.
- Deletions of any kind, and project / API-key / membership / organization /
  SCIM administration are out of scope for this skill. Use the Langfuse UI or
  admin API directly for those.
- Never print, inspect, or ask for `LANGFUSE_BASIC_AUTH`; the gateway injects it
  server-side as `Authorization: Basic <secret:LANGFUSE_BASIC_AUTH>`.
- Prompt names, dataset names, and run names are URL-encoded by the helper; pass
  the human-readable name, not a pre-encoded one.
- For metrics, pass a single JSON object to `--query` per the Langfuse Metrics
  API; the helper validates it parses and forwards it unchanged.
- Cost per assistant run is recorded by HybridClaw `UsageTotals`; helper output
  includes `costMeasurement.system = "UsageTotals"` for eval verification.

## Eval Suite

```bash
node skills/langfuse/langfuse.cjs --format json eval-scenarios
```

The fixture at `evals/scenarios.json` contains 10 scenarios covering trace,
observation, session, score, metric, prompt, and dataset reads plus guarded
score, dataset, and prompt writes.

## Validation

```bash
python3 skills/skill-creator/scripts/quick_validate.py skills/langfuse
node skills/langfuse/langfuse.cjs --help
node skills/langfuse/langfuse.cjs --format json eval-scenarios
```
