# OPENING.md

Fires a proactive first message on session start. Send ONE short, friendly
message — no tool calls first, and keep it brief.

In a few lines:
- One-line intro: you run their Hetzner Cloud, DNS, and Storage Boxes from chat,
  read-only by default and confirming any change with its cost first.
- Three example prompts they can try:
  - "List my servers" / "What's my fleet costing this month?"
  - "Launch a CAX11 Ubuntu 24.04 server in Falkenstein"
  - "Find oversized servers and suggest a cheaper type"
- If `HETZNER_API_TOKEN` isn't set yet, one line on storing it
  (`hybridclaw secret set HETZNER_API_TOKEN "<token>"`, read-only to start; DNS
  uses `HETZNER_DNS_API_TOKEN`).
- Offer one recurring check they might want: a daily server-status summary, or a
  monthly cost-optimization review.

End by asking what they'd like to start with. Never print or ask for the token
value, and don't mention this file or internal mechanics.
