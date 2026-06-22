# Scope & Definitions

*Regulation (EU) 2024/1689. Compiled 22 June 2026. Not legal advice.*

The first job of any audit is to decide **whether the Act applies at all** and
**in what role** the user acts. Get this wrong and every downstream conclusion is
wrong.

## 1. What is an "AI system"? (Article 3(1))

> "'AI system' means a machine-based system that is designed to operate with
> varying levels of autonomy and that may exhibit adaptiveness after deployment,
> and that, for explicit or implicit objectives, infers, from the input it
> receives, how to generate outputs such as predictions, content,
> recommendations, or decisions that can influence physical or virtual
> environments."

This is the OECD-aligned definition. Load-bearing elements:

- **machine-based**;
- **varying levels of autonomy** (not fully hand-driven);
- **may exhibit adaptiveness** after deployment (learning is possible but not required);
- **infers how to generate outputs** — the key differentiator from ordinary
  deterministic software;
- outputs are **predictions, content, recommendations, or decisions**.

The Commission's *Guidelines on the definition of an AI system* (6 February 2025)
clarify that simple, rule-based systems and basic data-processing that do not
"infer" generally fall **outside** the definition. A plain SQL query, a
hand-tuned threshold, or a static business-rules engine is usually not an AI
system; a trained ML model, an LLM integration, or a learned scoring model
usually is.

## 2. Who and what is in scope? (Article 2)

The Act binds, among others:

- **Providers** placing AI systems on the EU market or putting them into service,
  **or placing GPAI models on the EU market** — whether established in the EU or
  a third country.
- **Deployers** of AI systems that are established or located in the EU.
- **Importers** and **distributors** of AI systems.
- Product manufacturers placing an AI system on the market with their product,
  and authorised representatives of non-EU providers.

### Extraterritorial reach (Article 2(1)(c))

The Act also applies to providers and deployers **established in a third
country** "where the output produced by the AI system is used in the Union." A
US-only company whose model output reaches EU users can be in scope. Do not
assume "we're not an EU company" ends the analysis.

### Roles (Article 3)

- **Provider (3(3))** — develops an AI system or GPAI model (or has it developed)
  and places it on the market / puts it into service **under its own name or
  trademark**. *Providers carry the heaviest obligations.*
- **Deployer (3(4))** — uses an AI system under its own authority in a
  professional capacity (purely personal, non-professional use is excluded).
- **Importer (3(6))** / **Distributor (3(7))** — supply-chain actors making a
  third-party system available on the EU market.

A single organisation can be **both** provider and deployer (e.g. you fine-tune a
model and also run it in your product). Note also: a deployer that substantially
modifies a high-risk system, or puts its own name on it, or changes its intended
purpose, can **become a provider** with full provider obligations (Art. 25).

## 3. Exclusions (Article 2)

The Act does **not** apply to:

- **National security, military and defence** — systems placed on the market, put
  into service, or used **exclusively** for these purposes (Art. 2(3)).
- **Scientific research and development** — AI systems/models developed and put
  into service **for the sole purpose of scientific R&D** (Art. 2(6)).
- **Pre-market R&D and testing** activity *prior to* placing on the market or
  putting into service (Art. 2(8)) — **but testing in real-world conditions is
  NOT covered by this exemption.**
- **Purely personal, non-professional use** by a natural person (Art. 2(10)).

## 4. Free and open-source software (FOSS) — read the nuance carefully

Two distinct carve-outs that are easy to conflate:

- **AI *systems* released under free and open-source licences (Art. 2(12)):** the
  Regulation does **not** apply to them — **unless** they are placed on the
  market / put into service **as high-risk systems, or fall under Article 5
  (prohibited) or Article 50 (transparency).** So FOSS does **not** buy you out
  of the prohibitions, the high-risk regime, or the transparency duties.
- **GPAI *models* under a free and open-source licence (Art. 53(2)):** are
  exempt from the technical-documentation and downstream-information duties
  (Art. 53(1)(a)–(b)) **only if** weights, architecture and usage information are
  publicly available — **but the copyright policy and the training-content
  summary (Art. 53(1)(c)–(d)) still apply to everyone, and the exemption falls
  away entirely for models with systemic risk.** See
  [`05-gpai-models.md`](05-gpai-models.md).

## Audit takeaways

1. Confirm the thing is an **AI system** (or a **GPAI model**) under Art. 3 — not
   every algorithm qualifies.
2. Pin down the user's **role(s)** — provider, deployer, importer, distributor,
   or several at once. This drives the obligation set.
3. Check **extraterritoriality** — EU-facing output pulls non-EU actors in.
4. Check **exclusions**, but treat the FOSS and R&D carve-outs narrowly and note
   the "real-world testing" and "prohibited/high-risk/Art. 50" exceptions.

*Primary sources: [Art. 2](https://artificialintelligenceact.eu/article/2/),
[Art. 3](https://artificialintelligenceact.eu/article/3/),
[Art. 25](https://artificialintelligenceact.eu/article/25/),
[Art. 53](https://artificialintelligenceact.eu/article/53/), and the Commission
[Guidelines on the definition of an AI system](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-ai-system-definition-facilitate-first-ai-acts-rules-application).*
