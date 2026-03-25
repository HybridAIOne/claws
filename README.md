# Claws

Pre-built `.claw` agent packages for [HybridClaw](https://github.com/HybridAIOne/hybridclaw).

## Repository Structure

```
src/                          # Source directories (one per agent)
  felix-survey-dashboarding-expert/
    workspace/
      IDENTITY.md
      SOUL.md
      AGENTS.md
      ...
dist/                         # Compiled .claw files (zip archives)
  felix-survey-dashboarding-expert.claw
build.sh                      # Build script: src/ -> dist/
```

- **`src/`** contains the uncompressed agent workspace directories.
- **`dist/`** contains the built `.claw` files (ZIP archives ready for install).

## Building

Rebuild all `.claw` files from source:

```bash
./build.sh
```

Or point at a different source directory:

```bash
./build.sh /path/to/source/dirs
```

This zips each subdirectory in `src/` and writes `<dirname>.claw` to `dist/`.

## Installing a Claw

Download or clone this repo, then install a `.claw` file into your HybridClaw
instance:

```bash
# Inspect the package first
hybridclaw agent inspect dist/felix-survey-dashboarding-expert.claw

# Install it
hybridclaw agent install dist/felix-survey-dashboarding-expert.claw \
  --id felix --yes
```

If you prefer to install from a GitHub release:

```bash
gh release download v1.0.0 \
  --repo HybridAIOne/claws \
  --pattern '*.claw' \
  --dir /tmp/claws

hybridclaw agent install /tmp/claws/felix-survey-dashboarding-expert.claw \
  --id felix --yes
```

### What Happens on Install

1. The archive is validated (ZIP safety, size limits, no symlinks or traversal).
2. `manifest.json` is read and validated.
3. The agent is registered in `~/.hybridclaw/agents.json`.
4. `workspace/` files are copied into the agent's workspace path.
5. Bundled skills are restored into `workspace/skills/`.
6. Bundled plugins (if any) are installed via the normal plugin installer.
7. Runtime config is updated (skill dirs, plugin overrides).
8. Missing bootstrap files are filled from templates.

## Updating a Claw

There is no built-in update command. To update an installed agent to a newer
version:

```bash
# Pull latest sources
git pull

# Rebuild
./build.sh

# Re-install with --force to replace the existing workspace
hybridclaw agent install dist/felix-survey-dashboarding-expert.claw \
  --id felix --force --yes
```

The `--force` flag replaces the existing agent workspace and reinstalls bundled
plugins. Runtime state (session transcripts, runtime files) is not affected.

## Adding a New Claw

See [AGENTS.md](./AGENTS.md) for the full guide on creating `.claw` agent
packages.

Quick steps:

1. Create a new directory under `src/`:

   ```bash
   mkdir -p src/my-agent/workspace
   ```

2. Add the required workspace files (at minimum `IDENTITY.md`, `SOUL.md`,
   and a `manifest.json` at the directory root):

   ```bash
   src/my-agent/
     manifest.json
     workspace/
       IDENTITY.md
       SOUL.md
       AGENTS.md
       BOOT.md
       MEMORY.md
       TOOLS.md
       USER.md
       HEARTBEAT.md
       .hybridclaw/
         policy.yaml
   ```

3. Build:

   ```bash
   ./build.sh
   ```

4. Test the package:

   ```bash
   hybridclaw agent inspect dist/my-agent.claw
   hybridclaw agent install dist/my-agent.claw --id my-agent --yes
   ```

5. Commit both `src/my-agent/` and `dist/my-agent.claw`, then open a PR.

## Evals

Runtime-backed evals live under [evals/README.md](/Users/bkoehler/src/claws/evals/README.md).

Example:

```bash
node evals/run-claw-eval.mjs klara-voss
```
