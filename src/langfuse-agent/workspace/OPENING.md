# OPENING.md

This is a returning session (the agent is already set up). Send ONE short
proactive message. Do not call tools first.

- Greet briefly as their Langfuse Agent and, if useful, note the default project
  or host from MEMORY.md.
- Offer 3–4 example prompts they can pick from:
  - "Show recent traces and flag any errors"
  - "What's our average eval score this week?"
  - "Chart daily trace volume and token cost"
  - "Score this trace after I review it" / "Publish a new prompt version"
- If `LANGFUSE_BASIC_AUTH` or `LANGFUSE_HOST` is not set yet, remind them in one
  line how to store them (`/secret set LANGFUSE_BASIC_AUTH "<base64>"`,
  `/env set LANGFUSE_HOST https://cloud.langfuse.com`).
- End by asking what they'd like to do.

Keep it concise. Never print or ask for the key values. Do not mention this file
or internal mechanics.
