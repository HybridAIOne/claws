# Claw Evals

`evals/` contains runtime-backed agent evaluations for this repository.

These are not deterministic unit tests. They exercise real `.claw` packages
through a local HybridClaw runtime, install the agent into an isolated
temporary runtime directory, run agent-specific tasks, and save results for
inspection.

## Why `evals/` Instead Of `tests/`

- `tests/` usually implies deterministic, fast, CI-friendly checks.
- These evals depend on a working `hybridclaw` CLI, a configured model
  provider, and live skill imports during agent installation.
- The outputs are artifacts and health summaries, not pass/fail assertions
  alone.

## Runner

Run an eval for one agent by manifest id:

```bash
node evals/run-claw-eval.mjs klara-voss
```

Or use a built package path directly:

```bash
node evals/run-claw-eval.mjs dist/klara-voss-customer-operations-lead.claw
```

List the known agents with eval cases:

```bash
node evals/run-claw-eval.mjs --list
```

Useful flags:

```bash
node evals/run-claw-eval.mjs klara-voss --rebuild
node evals/run-claw-eval.mjs klara-voss --skip-externals
node evals/run-claw-eval.mjs felix --model gpt-5.4
node evals/run-claw-eval.mjs felix --model gpt-5.4 --chatbot-id your-bot-id
node evals/run-claw-eval.mjs klara-voss --sandbox host
node evals/run-claw-eval.mjs klara-voss --results-dir /tmp/claw-evals
```

## What The Runner Does

1. Checks that `hybridclaw` is installed.
2. Resolves the selected agent from this repo.
3. Creates an isolated `HYBRIDCLAW_DATA_DIR` under the system temp directory.
4. Copies the current runtime config and credentials into that isolated runtime.
5. Installs the target `.claw` package.
6. Copies any task fixtures from `evals/fixtures/` into
   `inputs/evals/<task-id>/` inside the isolated agent workspace.
7. Starts the HybridClaw gateway on a per-run local port.
8. Sends one or more agent-specific tasks through `/api/chat`.
9. Copies the generated transcript and deliverable artifacts into the result
   folder.
10. Writes `health.json` and `summary.md`.

## Output Layout

Each run writes to:

```text
evals/results/<timestamp>-<agent-id>/
  health.json
  summary.md
  logs/
    inspect.stdout.log
    inspect.stderr.log
    install.stdout.log
    install.stderr.log
    gateway.log
  prompts/
  raw/
  transcripts/
  artifacts/
```

`health.json` includes:

- install and gateway status
- per-task pass/fail
- transcript and artifact paths
- total tool executions
- successful command percentage based on `toolExecutions`

`transcripts/` prefers the workspace `.session-transcripts` file when present and
also copies the audit wire log as a fallback, so failed turns still leave a
replayable transcript artifact.

The isolated HybridClaw runtime home is created under the system temp
directory, not inside the repo, so copied `credentials.json` and
`codex-auth.json` never land in tracked or trackable workspace outputs.

## Case Format

Each agent entry in [cases/agents.json](/Users/bkoehler/src/claws/evals/cases/agents.json)
contains a `tasks` array. The runner now supports mixed artifact types per task,
including:

- text artifacts such as `.md`, `.txt`, `.html`, `.eml`, `.ics`, and `.diff`
- structured text artifacts such as `.json` and `.csv`
- OOXML office artifacts such as `.docx`, `.xlsx`, and `.pptx`

Useful task fields:

- `fixtures`: relative fixture files under `evals/fixtures/` that will be
  staged into `inputs/evals/<task-id>/` before the task runs
- `artifactPath`: expected output file path inside the agent workspace
- `responseMustInclude`: strings that must appear in the assistant reply
- `requiredArtifactStrings`: required text fragments for text-like artifacts
- `requiredJsonKeys`: required top-level keys for JSON artifacts
- `requiredCsvHeaders`: required headers for CSV artifacts
- `requiredArchiveEntries`: optional extra ZIP entries to require for OOXML artifacts
- `artifactFormat`: optional explicit format override when extension-based inference is not enough

The fixture corpus is meant to look like normal workplace input material:
CSV exports, intranet HTML pages, support emails, handbooks, notes, and other
role-specific source documents. Prompts should reference those staged files
directly instead of asking the agent to invent context.

## Notes

- The eval runner uses a copied runtime config plus credentials so it can reuse
  your existing HybridClaw provider setup without polluting your main runtime.
- If your current HybridClaw environment is not authenticated with a usable
  model provider, the gateway or task execution step will fail and that failure
  will be recorded in `health.json`.
- `--skip-externals` mirrors the HybridClaw install flag for manifest-declared
  external refs. It does not bypass security scanning for `skills.imports`, so
  an eval can still fail at install time if an imported community skill is
  blocked by your runtime policy.
- If the inherited default model is `openai-codex/...` and you are running
  evals from inside Codex, prefer `--model gpt-5.4` or another non-Codex model
  to avoid nested Codex MCP failures in host mode.
- If you run a HybridAI model directly and your runtime has no default chatbot
  configured, pass `--chatbot-id <id>` for that eval run.
