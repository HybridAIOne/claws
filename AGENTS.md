# Creating Claw Files

This guide describes how to create `.claw` agent packages from scratch.

A `.claw` file is a ZIP archive containing a `manifest.json` and a `workspace/`
directory with the files that define an agent's identity, personality, skills,
and configuration.

For the current canonical `.claw` format definition, archive layout, manifest
schema, and CLI behavior, refer to the official HybridClaw documentation:
<https://www.hybridclaw.io/development/extensibility/agent-packages.md>. Treat
this file as a local quick-start guide and the docs page as the source of
truth when they differ.

## Workspace Structure

Every claw source directory follows this layout:

```
my-agent/
  manifest.json                  # Required — package metadata
  workspace/                     # Required — agent workspace files
    IDENTITY.md                  # Who the agent is
    SOUL.md                      # Personality, values, and rules
    AGENTS.md                    # Workspace conventions and guidelines
    BOOTSTRAP.md                 # One-time first-run onboarding / hatching
    BOOT.md                      # Startup instructions
    MEMORY.md                    # Persistent memory structure
    TOOLS.md                     # Local infrastructure notes
    USER.md                      # Info about the human user
    HEARTBEAT.md                 # Periodic task definitions
    .hybridclaw/
      policy.yaml                # Approval policies and security fences
    skills/                      # Optional — bundled skills
      my-skill/
        SKILL.md
        agents/
          openai.yaml            # Optional — agent configs per skill
    assets/                      # Optional — images, avatars, etc.
```

## Required Files

### manifest.json

The manifest describes the package metadata. Minimal example:

```json
{
  "formatVersion": 1,
  "name": "My Agent",
  "id": "my-agent"
}
```

Full manifest with all optional fields:

```json
{
  "formatVersion": 1,
  "name": "My Agent",
  "id": "my-agent",
  "description": "A short description of what this agent does",
  "author": "Your Name",
  "version": "1.0.0",
  "createdAt": "2026-03-23T00:00:00Z",
  "agent": {
    "model": "claude-sonnet-4-6",
    "enableRag": false
  },
  "skills": {
    "bundled": ["my-skill"],
    "external": [
      {
        "kind": "git",
        "ref": "https://github.com/example/some-skill.git",
        "name": "some-skill"
      }
    ]
  },
  "plugins": {
    "bundled": ["my-plugin"],
    "external": [
      {
        "kind": "npm",
        "ref": "some-npm-plugin"
      }
    ]
  },
  "config": {
    "skills": {
      "disabled": ["skill-to-disable"]
    }
  }
}
```

**Rules:**

- `formatVersion` must be `1`.
- `name` is required and cannot be empty.
- `id` is sanitized to lowercase alphanumeric plus `-` and `_`.
- `skills.bundled` must list directory names that exist under `workspace/skills/`
  (or archive `skills/` when packed).
- External skill refs must use `kind: "git"` (other kinds are not supported in
  v1).

### IDENTITY.md

Defines who the agent is. Example:

```markdown
# IDENTITY.md - Who Am I?

- **Name:** Felix
- **Creature:** Survey dashboarding specialist
- **Vibe:** Calm, analytical, visually opinionated, presentation-ready
- **Emoji:** 📊
- **Avatar:** assets/felix-avatar.svg

---

Felix specializes in survey design, cross-tabulation, trend tracking,
and dashboard storytelling.
```

### SOUL.md

The agent's personality, values, core truths, and behavioral rules. This is the
most important file — it shapes how the agent thinks, speaks, and acts.

Structure it with:

- **Opening paragraph** — one-sentence summary of who the agent is.
- **Core Truths** — the principles the agent always follows.
- **Rules** — specific behavioral guidelines.
- **Voice** — how the agent communicates.

### AGENTS.md

Workspace-level rules and conventions. Covers things like:

- What the agent should do on startup.
- How to handle memory updates.
- Safety guidelines and boundaries.
- How to interact with tools and external systems.

### BOOTSTRAP.md

One-time onboarding instructions that run on the agent's first launch. Use this
to make the agent introduce itself, ask a small set of onboarding questions
about the user, write the answers into `USER.md` / `MEMORY.md`, and then delete
the file so it does not run again.

Recommended onboarding questions:

- what the user should be called
- their role or team
- their main goals or recurring use cases for the persona
- preferred tone / output style
- relevant tools, systems, or data sources
- timezone or working cadence

### BOOT.md

Short startup instructions — what the agent should do first when a session
begins. Keep this brief and actionable.

### MEMORY.md

Defines the structure for persistent memory. The agent reads this at the start
of each session to recall facts, decisions, and patterns from prior
conversations.

### TOOLS.md

Notes about local infrastructure available to the agent: SSH hosts, API
endpoints, device names, installed software. This file is environment-specific
and may differ per installation.

### USER.md

Template for information about the human user: name, role, preferences,
timezone. Populated as the agent learns about its user.

### HEARTBEAT.md

Defines periodic tasks the agent should check on startup or during heartbeat
polls. Can be left empty if no periodic tasks are needed.

### .hybridclaw/policy.yaml

Security and approval policies:

```yaml
approval:
  pinned_red:
    - pattern: "rm -rf /"
    - paths: ["~/.ssh/**", "/etc/**", ".env*"]
    - tools: ["force_push"]

  workspace_fence: true
  max_pending_approvals: 3
  approval_timeout_secs: 120

audit:
  log_all_red: true
  log_denials: true
```

## Adding Skills

Skills are `SKILL.md` files with optional supporting files, placed under
`workspace/skills/<skill-name>/`:

```
workspace/skills/my-skill/
  SKILL.md                     # Skill definition with YAML frontmatter
  agents/
    openai.yaml                # Optional agent config for the skill
```

A `SKILL.md` file uses YAML frontmatter:

```markdown
---
name: my-skill
description: What this skill does
user-invocable: true
---

Instructions for the agent when this skill is activated.
```

List all bundled skill directory names in `manifest.json` under
`skills.bundled`.

## Building a .claw File

### From this repository

Add your source directory under `src/`, then run:

```bash
./build.sh
```

This zips each `src/<name>/` directory into `dist/<name>.claw`.

### Using HybridClaw CLI

If you already have a running agent, you can export it directly:

```bash
hybridclaw agent export my-agent -o my-agent.claw \
  --skills all --plugins active \
  --description "My agent" --author "Name" --version "1.0.0"
```

### Programmatically

1. Create a standard ZIP archive.
2. Write `manifest.json` at the archive root.
3. Place workspace files under `workspace/`.
4. Place bundled skills under `skills/<dir>/` and list them in
   `manifest.skills.bundled`.
5. Place bundled plugins under `plugins/<id>/` and list them in
   `manifest.plugins.bundled`.
6. Ensure bundled directory lists match archive contents exactly.

## Validation

Before distributing, always inspect your package:

```bash
hybridclaw agent inspect dist/my-agent.claw
```

This validates the archive structure, manifest schema, and bundled content
without extracting.

## Archive Limits

`.claw` archives are validated on unpack with these safety limits:

| Limit                | Value     |
| -------------------- | --------- |
| Max entries          | 10,000    |
| Max compressed size  | 100 MB    |
| Max uncompressed size| 512 MB    |
| Max text entry size  | 1 MB      |

Archives with symlinks, encrypted entries, or absolute/traversal paths are
rejected.

## Checklist for a New Claw

- [ ] `manifest.json` with `formatVersion: 1` and a `name`
- [ ] `workspace/IDENTITY.md` with name, creature, vibe, emoji
- [ ] `workspace/SOUL.md` with personality, core truths, rules, voice
- [ ] `workspace/AGENTS.md` with workspace conventions
- [ ] `workspace/BOOTSTRAP.md` with first-run onboarding instructions
- [ ] `workspace/BOOT.md` with startup instructions
- [ ] `workspace/MEMORY.md` with memory structure
- [ ] `workspace/TOOLS.md` with infrastructure notes
- [ ] `workspace/USER.md` with user template
- [ ] `workspace/.hybridclaw/policy.yaml` with approval policies
- [ ] Skills listed in `manifest.skills.bundled` match `workspace/skills/` dirs
- [ ] `hybridclaw agent inspect` passes
- [ ] Test install with `hybridclaw agent install dist/my-agent.claw --id test-agent`
