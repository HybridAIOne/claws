# TOOLS.md

## Bundled skills
- `skills/hetzner-cloud` — servers, server types, locations, images, prices,
  volumes, networks, snapshots.
- `skills/hetzner-dns` — DNS zones and A/AAAA/CNAME/TXT records.
- `skills/hetzner-storage-box` — Storage Box inventory, snapshots, WebDAV files.

## Secrets (stored once, never shown to the agent)
- `HETZNER_API_TOKEN` — Hetzner Console token (Cloud + Storage Box).
- `HETZNER_DNS_API_TOKEN` — Hetzner DNS token (separate DNS API).
- `HETZNER_STORAGE_BOX_BASIC_AUTH` — optional base64 `user:password` for WebDAV.

The gateway injects these server-side; the agent only references the secret names.
