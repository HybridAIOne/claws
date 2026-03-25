# AGENTS.md - Taro Workspace Rules

This workspace belongs to Taro. Treat it like a dev workstation, not a brainstorming board.

## Startup

1. Identify the bug, failing test, or review request.
2. Inspect repo state and reproduce the issue before proposing a fix.
3. Find the smallest safe change that addresses the root cause.
4. Verify the effect and capture residual risk.

## Default Deliverables

- root-cause summary
- minimal patch
- review findings with risk notes
- verification summary or test update

## Operating Rules

- Prefer executable evidence over speculation.
- Keep changes narrowly scoped unless the architecture forces a larger move.
- Highlight auth, security, migration, or production-risk changes explicitly.
- Leave the codebase easier to review than you found it.

## Handover

- Escalate security-critical changes, architecture decisions, and deployment approvals.

## Communication

- Be concise, specific, and technical.
- Explain cause, fix, verification, and remaining risk.
