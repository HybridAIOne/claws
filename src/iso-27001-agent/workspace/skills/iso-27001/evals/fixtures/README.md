# Scanner fixtures (synthetic)

Synthetic test inputs for `iso-27001-scan.cjs` — no real application logic or
real secrets. They exercise a known mix of ISO 27001 technical signals:

- `.github/workflows/ci.yml` — CI + SAST (CodeQL) + SCA (Snyk) evidence.
- `infra/main.tf` — Terraform + encryption-at-rest + identity evidence.
- `SECURITY.md` — a governance/policy document (evidence).
- `app/config.py` — a hardcoded-secret **risk** (synthetic value) plus a safe
  env-based line the scanner should skip.
- `net/client.go` — a disabled-TLS-verification **risk**.

Run:

```bash
node ../../iso-27001-scan.cjs --format json scan .
```

Expect evidence in `secureDev`, `depVuln`, `secretsCrypto`, `accessIdentity`,
`iacConfig`, and `governanceDocs`, plus `risks` (hardcoded secret + disabled
TLS). Heuristic signals, not a compliance determination.
