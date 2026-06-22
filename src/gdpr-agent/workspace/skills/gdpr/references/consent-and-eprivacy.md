# Consent & ePrivacy (Art. 6/7, Art. 8; cookies under ePrivacy + TTDSG/TDDDG)

Consent is **one** of six lawful bases (Art. 6(1)(a)) — often not the best one for
core processing (contract or legitimate interests may fit better and not be
withdrawable mid-service). But for **cookies/tracking** and for **special-category
data** it is frequently the operative basis, and the bar is high.

## Valid consent (Art. 4(11), Art. 7; Recitals 32, 42, 43)

Consent must be:
- **Freely given** — no bundling with service provision (Art. 7(4)); no imbalance
  of power coercion; granular per purpose.
- **Specific** — separate consent per distinct purpose.
- **Informed** — who, what, why, and that it can be withdrawn.
- **Unambiguous** — a clear affirmative act. **No pre-ticked boxes, no silence, no
  "by using this site you agree"** (CJEU *Planet49*, C-673/17).
- **Demonstrable** — you must be able to **prove** consent (Art. 7(1)): record who,
  when, what they were shown, and what they agreed to.
- **Withdrawable** — as easy to withdraw as to give (Art. 7(3)); withdrawal is
  prospective only.

### Children (Art. 8)
For information-society services offered directly to children, consent requires a
holder of parental responsibility below the national age threshold (16 under the
GDPR default; Member States may lower to **as low as 13** — Germany: 16).

## Cookies & device storage — ePrivacy + TTDSG/TDDDG §25

Storing or reading information on a user's device (cookies, localStorage, pixels,
fingerprinting) needs **prior opt-in consent** unless it is **strictly necessary**
to provide a service the user **explicitly requested** (e.g. session, load
balancing, security, cart). Analytics, advertising, A/B testing, and most
third-party embeds are **not** strictly necessary → consent first.

In Germany this is **TTDSG §25** (the act was renamed **TDDDG** in Dec 2024 — same
§25). It sits *alongside* the GDPR: §25 governs the read/write to the device; the
GDPR governs any personal data thereby processed.

### Compliant cookie banner — rules of thumb
- No non-essential cookie/script fires **before** consent (no "load then ask").
- **Accept and Reject are equally easy** (no "Accept all" button with reject buried
  two layers down) — guidance from EDPB and German authorities.
- Granular per purpose/category; no pre-checked toggles.
- Withdrawal always reachable (e.g. a persistent "Cookie settings" link).
- Store a **consent record** (see below).

## Consent record (proof — Art. 7(1))

```
subject/user ref (pseudonymous ok) | timestamp | purpose(s) consented | text/version shown
| ui method (e.g. banner v3) | granted/withdrawn | withdrawal timestamp (if any)
```

## Marketing email

Combine GDPR consent with national ePrivacy rules. The narrow **existing-customer
"soft opt-in"** (own similar products, contact obtained in a sale, easy opt-out
every time) may apply — verify nationally. Always provide one-click unsubscribe
and honour Art. 21(2) objections absolutely.

> Consent-vs-legitimate-interests and soft-opt-in calls are fact-specific. Confirm
> the lawful-basis choice and any marketing approach with counsel/DPO.
