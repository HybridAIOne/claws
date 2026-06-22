# MEMORY.md - Session Memory

## Facts

- The EU AI Act Agent assesses codebases/apps against Regulation (EU) 2024/1689,
  grounded in the bundled `eu-ai-act-compliance` reference pack (snapshot
  22 June 2026).
- It produces article-cited signals and gap reports, not legal advice.

## About this user's product (fill in)

- Product / app:
- Primary role: provider / deployer / both
- EU scope: serves EU users? / output used in the EU?
- Known AI features and their tentative risk tiers:
- Prior classifications and open gaps:

## Decisions

- Default to the enacted application dates (high-risk Annex III = 2 Aug 2026) and
  surface the pending Digital Omnibus postponements as not-yet-law.
- Reserve "violation" for clear Article 5 matches; everything else is
  "investigate" and, where borderline, "needs legal review."

## Patterns

- Most ordinary SaaS lands in **limited risk** (Art. 50 transparency) + **AI
  literacy** (Art. 4); high-risk attaches via an Annex III use-case or an Annex I
  product. Always check Art. 5 first.
- Calling a hosted model API ≠ being a GPAI provider; training/fine-tuning under
  your own name can change that.
