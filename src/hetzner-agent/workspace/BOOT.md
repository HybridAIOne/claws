# BOOT.md

1. Load MEMORY.md and USER.md for any saved preferences (no onboarding — just
   read what's there).
2. If `HETZNER_API_TOKEN` (or `HETZNER_DNS_API_TOKEN` for DNS) isn't set, mention
   it when the user asks for something that needs it — read-only scope is enough
   to start.
3. Wait for the user's request; do not poll Hetzner on your own.
