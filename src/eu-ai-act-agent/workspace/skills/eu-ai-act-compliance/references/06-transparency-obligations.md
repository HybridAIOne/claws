# Transparency Obligations (Article 50) — Limited Risk

*Regulation (EU) 2024/1689. Compiled 22 June 2026. Not legal advice.*
Article 50 applies from **2 August 2026** (the synthetic-content marking duty for
systems already on the market is being pushed to ~2 December 2026 by the pending
Digital Omnibus — see [`02-timeline-and-status.md`](02-timeline-and-status.md)).

These duties catch a **very large share of ordinary apps**: any chatbot, any
generative-AI feature, any deep-fake or voice-clone tool. They are usually the
*most relevant obligations for a typical SaaS product* even when the system is
not high-risk.

## The duties

**50(1) — "You're talking to an AI" (provider duty).** AI systems that **interact
directly with people** must be designed so users are **informed they are
interacting with an AI**, unless it is obvious to a reasonably well-informed
person. (Narrow law-enforcement exception.)

**50(2) — Mark synthetic content machine-readably (provider duty, incl. GPAI).**
Providers of generative systems must ensure outputs (**audio, image, video, or
text**) are **marked in a machine-readable format and detectable as artificially
generated or manipulated**, using effective, interoperable, robust and reliable
techniques as far as technically feasible (e.g. watermarks, metadata,
provenance/C2PA-style signals). Exceptions: assistive/standard-editing functions
that do not substantially alter input, and certain law-enforcement uses.

**50(3) — Emotion recognition / biometric categorisation (deployer duty).**
Deployers must **inform the people exposed** to such a system and process their
data lawfully under the GDPR. (Law-enforcement exception.)

**50(4) — Deep fakes & public-interest text (deployer duty).** Deployers who
**generate or manipulate** image/audio/video that is a **deep fake** must
**disclose** it is artificially generated/manipulated. For **artistic, creative,
satirical or fictional** works, disclosure is limited to a manner that does not
spoil the work. Deployers generating **text published to inform the public on
matters of public interest** must disclose AI generation — unless the content had
**human review / editorial responsibility**.

**50(5) — How.** Disclosures must be **clear and distinguishable, no later than
the first interaction or exposure**, and meet accessibility requirements.

**50(7) — Code of Practice.** The AI Office facilitates a **Code of Practice on
the detection and labelling of AI-generated content**; the final Code was
published mid-2026 and covers provider marking and deployer disclosure. Signing
is voluntary; the Art. 50 obligations themselves are binding from the dates
above.

## What to look for in a codebase / app

- **Chatbots / assistants:** is there a clear "you're chatting with an AI"
  notice at first interaction? (Look at the UI strings, system prompts,
  onboarding copy.) Missing → 50(1) gap.
- **Generative outputs:** does the pipeline attach **machine-readable provenance
  / watermark / metadata** (e.g. C2PA, SynthID-style, signed metadata) to
  generated images/audio/video/text? Absent → 50(2) gap.
- **Deep-fake / face-swap / voice-clone features:** is there a visible
  **"AI-generated" disclosure** to end-users/viewers? Absent → 50(4) gap.
- **Emotion / biometric categorisation features used on people:** is there a
  notice to exposed persons? Absent → 50(3) gap (and check it is not actually a
  **prohibited** use under Art. 5(1)(f)/(g) — see
  [`03-prohibited-practices.md`](03-prohibited-practices.md)).

Transparency gaps are the most common and most *fixable* findings — usually a UI
disclosure plus a provenance/watermarking step in the generation pipeline.

*Primary source: [Article 50 (AI Act Explorer)](https://artificialintelligenceact.eu/article/50/);
Commission [Code of Practice on marking AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content).*
