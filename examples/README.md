# Coworker Demo Examples

These files are small, reusable artifacts for demonstrating the personas in a
normal work setting.

## Lena Adler, Market Research Executive

Install and switch:

```bash
hybridclaw agent install dist/lena.claw --id lena --yes
/agent switch lena
/agent info
```

Then use the attached files:

```text
Can you take a first pass on @file:examples/lena-adler/market-watch.html and
@file:examples/lena-adler/competitor-signals.csv? Please summarize the pricing
moves, separate facts from interpretation, and tell me the packaging
implication.
```

## Jonas Reiter, Meeting Intelligence Coordinator

Install and switch:

```bash
hybridclaw agent install dist/jonas-reiter-meeting-intelligence-coordinator.claw --id jonas --yes
/agent switch jonas
/agent info
```

Then use the meeting notes:

```text
Can you turn @file:examples/jonas-reiter/meeting-notes.md into decisions,
open questions, owners, deadlines, and a follow-up note I can send out?
```

## Taro Weiss, Engineering Co-Pilot

Install and switch:

```bash
hybridclaw agent install dist/taro-weiss-engineering-co-pilot.claw --id taro --yes
/agent switch taro
/agent info
```

Then use the bug report:

```text
Can you take a look at @file:examples/taro-weiss/bug-report.md, reproduce the
issue, and tell me the smallest fix you would make?
```
