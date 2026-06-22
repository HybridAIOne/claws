# Risk Assessment & Treatment

*ISO/IEC 27001:2022, clauses 6.1.2 and 6.1.3. Compiled 22 June 2026. Paraphrased,
not the standard text. Not legal/audit advice.*

Risk assessment and treatment are the **engine of the ISMS** — controls exist
because a risk assessment justified them. Auditors trace controls back to risks
through this work and the Statement of Applicability.

## Risk assessment — clause 6.1.2

The organisation must **define and maintain a risk assessment process** that:

- establishes and maintains **risk criteria**, including **risk acceptance
  criteria** and criteria for performing assessments;
- produces **consistent, valid, comparable** results when repeated;
- **identifies** risks to confidentiality, integrity and availability within the
  ISMS scope, and identifies **risk owners**;
- **analyses** risks (impact × likelihood) to determine risk levels;
- **evaluates** risks against the criteria and **prioritises** them for treatment.

ISO 27001 does **not** mandate a specific methodology (asset-based, scenario-based,
etc.) — only that the process be defined and repeatable.

## Risk treatment — clause 6.1.3

The organisation must **define and apply a risk treatment process** that selects
treatment options and the controls needed. The **four treatment options** (labels
vary by source; the set is the same):

1. **Modify / reduce** — apply controls to lower likelihood and/or impact.
2. **Retain / accept** — knowingly accept, within the risk acceptance criteria.
3. **Avoid** — stop or change the activity that creates the risk.
4. **Share / transfer** — shift part of it to a third party (insurance,
   outsourcing, contractual terms).

Clause 6.1.3 then requires:

- comparing the selected controls against **Annex A** to check none necessary was
  omitted;
- producing the **Statement of Applicability** (6.1.3(d) — see
  [`04-certification-and-soa.md`](04-certification-and-soa.md));
- a **risk treatment plan** (actions, owners, and in practice timelines/resources);
- **risk owners' approval** of the plan and **acceptance of residual risks**.

## Residual risk and ongoing operation

After controls are applied, the remaining **residual risk** must be evaluated and
formally **accepted by the risk owner**. Risk assessments and treatment are
re-run at planned intervals and when significant change occurs (clause 8.2/8.3),
with results retained as documented information.

## ISO/IEC 27005

**ISO/IEC 27005** is the information-security **risk-management guidance**
companion. It is advisory, not certifiable — useful for choosing a method, but
27001 does not require it.

## What an audit looks at in code/infra

For an engineering-focused review, tie technical findings back to risk:

- A repo-level finding (e.g. an unmanaged dependency with a known CVE) is
  **evidence of a risk** that the ISMS should be tracking under A.8.8 and the
  risk register.
- Map each significant technical gap to the **control** that would treat it and
  note it belongs in the **risk treatment plan / SoA**, not just a code fix.

*Primary sources in [`08-sources.md`](08-sources.md).*
