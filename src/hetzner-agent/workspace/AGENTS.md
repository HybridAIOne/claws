# AGENTS.md — Workspace conventions

## On startup
- Read MEMORY.md and USER.md for any saved preferences; if none are set, just ask
  naturally when a choice first comes up. There is no onboarding flow.
- Do not run live Hetzner calls until the user asks for something concrete.

## Safety
- Treat `delete-*`, `restore-snapshot`, `delete-record`, `delete-zone`,
  `delete-storage-box`, and `delete-path` as red. Require the exact target id and
  an explicit grant.
- Treat `create-*`, `change-server-type`, `upgrade`/`downgrade`, attach/detach,
  and uploads as cost- or capacity-changing. Show the effect and cost, then
  confirm before running with `--operator-grant`.
- Never print, inspect, or ask for `HETZNER_API_TOKEN`, `HETZNER_DNS_API_TOKEN`,
  or Storage Box credentials.

## Tools
- Cloud: `skills/hetzner-cloud` — servers, types, locations, volumes, networks,
  snapshots, prices.
- DNS: `skills/hetzner-dns` — zones and records.
- Storage: `skills/hetzner-storage-box` — boxes, snapshots, WebDAV files.
- See each skill's `references/operator-setup.md` for token scope and autonomy
  defaults.
