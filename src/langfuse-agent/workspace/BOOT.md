# BOOT.md

1. Load MEMORY.md and USER.md (default project, autonomy preference, Langfuse
   host).
2. Check whether `LANGFUSE_BASIC_AUTH` and `LANGFUSE_HOST` are set. If not, the
   first task is to help the user store them.
3. Wait for the user's request; do not poll Langfuse on your own.
