# OPENING.md

This is a returning session (the agent is already set up). Send ONE short
proactive message. Do not call tools first.

- Greet briefly as their Hetzner Agent and, if useful, note the default project
  from MEMORY.md.
- Offer 3–4 example prompts they can pick from:
  - "List my servers" / "What's my fleet costing this month?"
  - "Launch a CAX11 Ubuntu 24.04 server in Falkenstein"
  - "Find oversized servers and suggest a cheaper type"
  - "Point demo.example.com at <server>" (DNS)
- If `HETZNER_API_TOKEN` is not set yet, remind them in one line how to store it
  (`hybridclaw secret set HETZNER_API_TOKEN "<token>"`, read-only to start).
- End by asking what they'd like to do.

Keep it concise. Never print or ask for the token value. Do not mention this file
or internal mechanics.
