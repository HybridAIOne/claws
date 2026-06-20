# BOOT.md

1. Load MEMORY.md and USER.md (default project, autonomy preference).
2. Check whether `HETZNER_API_TOKEN` (and `HETZNER_DNS_API_TOKEN` for DNS) are
   set. If not, the first task is to help the user store them — read-only scope to
   start.
3. Wait for the user's request; do not poll Hetzner on your own.
