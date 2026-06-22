# Prohibited Practices (Article 5) — Unacceptable Risk

*Regulation (EU) 2024/1689. Compiled 22 June 2026. Not legal advice.*
**Applicable since 2 February 2025.** These are hard bans: placing on the market,
putting into service, or using such systems is unlawful regardless of role or
licence (the FOSS carve-out does not help here). A confirmed Art. 5 hit is the
single most serious finding an audit can make — fines reach **€35M or 7% of
global annual turnover** ([`07-penalties-and-governance.md`](07-penalties-and-governance.md)).

## The eight prohibitions (Art. 5(1)(a)–(h))

**(a) Harmful manipulation / subliminal or deceptive techniques.** AI deploying
subliminal techniques beyond a person's consciousness, or purposefully
manipulative or deceptive techniques, with the object or effect of materially
distorting behaviour by impairing informed decision-making, causing or likely to
cause **significant harm**. *Intent is not required — "object or effect."*

**(b) Exploitation of vulnerabilities.** Exploiting vulnerabilities due to
**age, disability, or a specific social or economic situation** to materially
distort behaviour in a way that causes or is likely to cause significant harm.

**(c) Social scoring.** Evaluating or classifying people over time based on
social behaviour or personal/personality characteristics, where the resulting
score leads to **detrimental or unfavourable treatment** that is either (i) in
**contexts unrelated** to where the data was collected, or (ii) **unjustified or
disproportionate** to the behaviour.

**(d) Individual crime-risk prediction by profiling.** Assessing or predicting
the risk of a person committing a criminal offence **based solely on profiling
or personality traits**. *Carve-out:* supporting a human assessment that is
already based on objective, verifiable facts directly linked to criminal
activity is allowed.

**(e) Untargeted facial-image scraping.** Creating or expanding
facial-recognition databases through **untargeted scraping** of facial images
from the internet or CCTV footage.

**(f) Emotion recognition at work or in education.** Inferring emotions of people
in **workplace** or **education** settings. *Exception:* systems put in place for
**medical or safety** reasons (e.g. fatigue detection for safety).

**(g) Biometric categorisation inferring sensitive attributes.** Categorising
individuals based on biometric data to **deduce or infer race, political
opinions, trade-union membership, religious or philosophical beliefs, sex life,
or sexual orientation**. *Carve-out:* labelling/filtering of lawfully acquired
biometric datasets, and certain law-enforcement categorisation.

**(h) 'Real-time' remote biometric identification (RBI) in public spaces for law
enforcement.** Banned **unless strictly necessary** for narrowly defined
objectives: targeted search for specific victims / missing persons; prevention
of a specific, substantial and imminent threat to life or of a terrorist attack;
or localising/identifying a suspect for serious offences (Annex II, ≥4-year
custodial maximum). Subject to prior judicial/independent authorisation,
notification, and Member-State enabling law (Art. 5(2)–(7)). *Post (ex-post) RBI
is not banned here — it is regulated as high-risk under Annex III.*

## Pending addition (Digital Omnibus — not yet law)

A **ninth prohibition** on AI generating **non-consensual intimate imagery (NCII)
and CSAM** ("nudifier" apps) is being added by the Digital Omnibus, with a safe
harbour for effective safeguards and a transitional period to ~2 December 2026.
Treat as **pending** until OJ publication — see
[`02-timeline-and-status.md`](02-timeline-and-status.md).

## What to look for in a codebase / app

These are *signals that warrant investigation*, not automatic violations — the
prohibitions turn on purpose, context and harm, which code alone cannot fully
establish:

- **(a)/(b)** dark-pattern engines, persuasion/optimisation loops that target
  emotional state, vulnerability targeting in ad/UX systems aimed at minors or
  distressed users.
- **(c)** cross-domain "trust/citizen/reputation score" features that gate access
  to unrelated services.
- **(d)** "predict reoffending / criminality from profile" models without a
  human-judgment, fact-based basis.
- **(e)** scrapers building face databases from web images or CCTV; integrations
  with such datasets (e.g. mass face-search providers).
- **(f)** emotion/affect detection wired to HR, proctoring, or classroom tools
  (keywords: `emotion`, `affect`, `sentiment` *of a person's face/voice*,
  `proctor`).
- **(g)** classifiers that output protected attributes from face/voice/biometrics.
- **(h)** live face recognition on public-space camera feeds for policing.

If any of these are present, **stop and flag prominently**: a real Art. 5 match
is existential, and the design/intended-purpose questions must be resolved with
legal counsel before launch in or into the EU.

*Primary source: [Article 5 (AI Act Explorer)](https://artificialintelligenceact.eu/article/5/);
Commission [Guidelines on prohibited practices, 4 Feb 2025](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-prohibited-artificial-intelligence-ai-practices-defined-ai-act).*
