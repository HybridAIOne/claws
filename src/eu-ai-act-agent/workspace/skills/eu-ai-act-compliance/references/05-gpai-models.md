# General-Purpose AI (GPAI) Models

*Regulation (EU) 2024/1689, Chapter V (Arts. 51–56). Compiled 22 June 2026. Not
legal advice.* GPAI obligations have applied since **2 August 2025**; the AI
Office's enforcement powers (and Art. 101 fines) bite from 2 August 2026. Models
already on the market before 2 Aug 2025 have until **2 August 2027** to comply
(Art. 111(3)).

This chapter matters to two very different audiences: teams **training or
distributing** a foundation model (you are a GPAI **provider**), and teams that
merely **call** someone else's model API (you are usually a **downstream
provider/deployer** of an AI *system*, not a GPAI model provider — but you may
inherit documentation and you still owe Art. 50 transparency).

## 1. What is a GPAI model? (Art. 3(63))

A model that displays **significant generality**, can **competently perform a
wide range of distinct tasks**, and **can be integrated into a variety of
downstream systems**. The definition is **qualitative** — do not state a numeric
FLOP floor as "the GPAI definition." (Recitals associate GPAI with large
generative models trained on broad data; the systemic-risk threshold below is a
separate, numeric test.)

## 2. Baseline obligations for ALL GPAI providers (Art. 53)

- **(a) Technical documentation** of the model, incl. training and testing
  process (Annex XI) — available to the AI Office / authorities on request.
- **(b) Information & documentation to downstream providers** who integrate the
  model (Annex XII), so they understand capabilities and limitations.
- **(c) Copyright policy** to comply with EU copyright law, including respecting
  the **Art. 4(3) text-and-data-mining opt-out** of Directive (EU) 2019/790.
- **(d) Public training-content summary** — a "sufficiently detailed summary" of
  the content used for training, using the **AI Office template**.

**Open-source nuance (Art. 53(2)):** models released under a free/open-source
licence with **publicly available weights, architecture and usage info** are
exempt from **(a)** and **(b)** — but **(c) copyright policy and (d) training
summary still apply to everyone**, and the exemption **does not apply to models
with systemic risk**.

## 3. GPAI models with systemic risk (Arts. 51 & 55)

- **Threshold (Art. 51).** A model is presumed to have **high-impact
  capabilities / systemic risk** when the cumulative training compute is
  **greater than 10²⁵ floating-point operations (FLOP)**, or when so designated
  by the Commission. Providers meeting the threshold must **notify the Commission
  without delay** (and may argue the model nonetheless lacks systemic risk).
- **Extra obligations (Art. 55):**
  - **(a)** state-of-the-art **model evaluation incl. adversarial testing
    (red-teaming)**;
  - **(b)** **assess and mitigate systemic risks** at Union level;
  - **(c)** **track and report serious incidents** to the AI Office without undue
    delay;
  - **(d)** ensure **adequate cybersecurity** for the model and its
    infrastructure.

## 4. GPAI Code of Practice (status)

- **Published 10 July 2025** by the Commission / AI Office; three chapters —
  **Transparency**, **Copyright**, **Safety & Security**.
- **Voluntary**, but the Commission and AI Board treat it as an **adequate tool**
  to demonstrate compliance with Arts. 53 (Transparency + Copyright) and 55
  (Safety & Security). Signing reduces administrative burden and increases legal
  certainty.
- Signatories include major model providers (the exact list shifts — verify
  against the live Commission list before citing a number).
- The **Guidelines for providers of GPAI models** (18 July 2025) clarify scope,
  the ~10²³ FLOP indicative training threshold for the GPAI definition, and the
  10²⁵ FLOP systemic-risk presumption.

## 5. Practical mapping for codebases / apps

- **You call a hosted model API (OpenAI, Anthropic, Google, etc.):** you are
  almost certainly **not** a GPAI *model* provider. Your obligations come from
  whether your **system** is high-risk and from **Art. 50 transparency**. Keep
  the upstream provider's model documentation/usage policy on file.
- **You fine-tune / further train and redistribute a model under your own name:**
  you may become a **provider** of a (modified) GPAI model and pick up Art. 53
  duties for your modification.
- **You train a large foundation model:** full Art. 53; if training compute could
  exceed **10²⁵ FLOP**, treat Art. 51 notification + Art. 55 as in-scope and plan
  evaluations/red-teaming and incident reporting early.
- **Copyright & training data:** for any model you train, a documented
  **copyright/TDM-opt-out policy** and a **training-content summary** are
  expected — look for their presence (or absence) in the repo/docs.

*Primary sources: Articles
[51](https://artificialintelligenceact.eu/article/51/),
[53](https://artificialintelligenceact.eu/article/53/),
[55](https://artificialintelligenceact.eu/article/55/),
[111](https://artificialintelligenceact.eu/article/111/); Commission
[GPAI Code of Practice](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai)
and [GPAI guidelines, 18 Jul 2025](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-guidelines-providers-general-purpose-ai-models).*
