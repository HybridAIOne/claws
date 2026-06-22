# Software Evidence Map (Annex A → code / CI / cloud)

*ISO/IEC 27001:2022. Compiled 22 June 2026. Paraphrased, original wording. Not
legal/audit advice.*

This maps the **software-relevant** Annex A controls to the concrete evidence an
engineering team typically produces. **Scope boundary:** a codebase/cloud review
covers mainly the **technological controls (A.8)** plus the technical half of a
few **organisational controls (A.5)**. People (A.6), physical (A.7), and most
governance (A.5 + clauses 4–10) need evidence a scanner never sees — record those
in the **SoA**. And remember: **a config proves a capability exists, not that the
process is operated** — pair every "green" config with operational records
(triaged findings, closed tickets, restore tests).

## Secure development & coding — A.8.25–A.8.31, A.8.33, A.8.4

- **Secure SDLC (A.8.25):** a documented secure-development policy; security gates
  per phase; SAST/DAST/SCA wired into CI.
- **App security requirements (A.8.26):** security acceptance criteria in
  tickets; per-app risk/threat assessment; a baseline like OWASP ASVS.
- **Secure architecture (A.8.27):** documented engineering principles (defence in
  depth, least privilege, fail-secure); design/architecture review records;
  hardened baseline templates.
- **Secure coding (A.8.28):** secure-coding standards; **SAST** (CodeQL, Semgrep,
  SonarQube) on PRs; **secret scanning + push protection**; **mandatory code
  review** (required approvals); linters / pre-commit hooks.
- **Security testing & acceptance (A.8.29):** SAST/DAST results, pentest reports
  with remediation, container/IaC scans, and a **release gate** that fails on
  High/Critical — auditors specifically look for a release that was *blocked* by a
  finding.
- **Outsourced development (A.8.30):** security clauses in contracts, vendor due
  diligence, independent acceptance testing. May be **N/A** if no outsourcing.
- **Env separation (A.8.31):** separate dev/test/prod (separate accounts /
  VPCs / namespaces); one-directional, approval-gated promotion pipeline.
- **Test information (A.8.33):** masked/synthetic test data; authorisation before
  copying production data. **Source-code access (A.8.4):** restricted, reviewed
  repo access.

## Change & configuration — A.8.32, A.8.9, A.8.19

- **Change management (A.8.32):** PR-based workflow (branch protection, required
  approvals, no direct push to `main`), tickets linked to changes, CI green
  checks, CD logs (who/when/what commit), tested rollback.
- **Configuration management (A.8.9):** **IaC** (Terraform/CloudFormation/Pulumi/
  Ansible/Helm) as the documented baseline; GitOps/drift detection; hardened
  images; IaC misconfig scanning (tfsec, Checkov, KICS); an exception register.
- **Software on operational systems (A.8.19):** approved-software/allowlisting,
  internal package registries, signed/immutable artifacts.

## Vulnerability & dependency management — A.8.8

- Dependency inventory + **SBOM** (CycloneDX/SPDX via syft/Trivy); **SCA in CI**
  (Dependabot, Renovate, Snyk, Trivy, Grype, OWASP Dependency-Check); **build
  gating** on severity; remediation **SLAs** (org-defined — ISO sets no number),
  tickets with CVE IDs, regenerated SBOM after patching.

## Cryptography & secrets — A.8.24 (and A.5.17)

- **In transit:** TLS 1.2/1.3, HSTS, managed certs, no plaintext HTTP.
- **At rest:** encryption flags on DB/storage (KMS/CMEK/SSE), visible in IaC.
- **Key management:** KMS / Key Vault / HSM, least-privilege key policies,
  automatic rotation.
- **Secrets:** secrets in a manager (Vault, Secrets Manager, Key Vault, Doppler,
  Sealed/External Secrets), `.env` git-ignored, **secret scanning** (gitleaks,
  TruffleHog) with evidence that detected secrets were **rotated**. Tag
  secret-handling against both **A.8.24** and **A.5.17**.

## Access control & identity — A.5.15–A.5.18, A.8.2, A.8.3, A.8.5

- **Policy & reviews (A.5.15/A.5.18):** access-control policy; periodic access
  reviews signed by owners; service accounts/API keys included.
- **Identity lifecycle (A.5.16):** named individual accounts; SCIM provisioning;
  joiner/mover/leaver records; machine-identity inventory.
- **Auth information (A.5.17):** password policy (length/history/breached-password
  blocking), strong hashing (bcrypt/scrypt/Argon2).
- **Privileged access (A.8.2):** admin inventory; JIT/PIM with expiry; privileged
  session logs; MFA; separation of duties (requester ≠ approver).
- **Access restriction (A.8.3):** default-deny IAM; data-layer restriction (RLS,
  column masking).
- **Secure authentication (A.8.5):** **MFA**/SSO coverage; adaptive access;
  lockout/rate limiting; auth success+failure logging.

## Logging & monitoring — A.8.15, A.8.16, A.8.17

- **Logging (A.8.15):** structured audit logs (actor/action/resource/timestamp);
  centralised/SIEM; tamper-resistant (append-only/WORM, S3 Object Lock); defined
  retention (org-defined).
- **Monitoring (A.8.16):** SIEM detection rules, GuardDuty/Defender, alerting with
  on-call, and **incident tickets that close the loop** (alert → triage → fix).
- **Clock sync (A.8.17):** NTP/chrony to a trusted source.

## Data protection — A.8.10, A.8.11, A.8.12, A.8.13

- **Deletion (A.8.10):** retention/disposal policy; lifecycle expiry rules;
  crypto-shredding; GDPR erasure workflow.
- **Masking (A.8.11):** dynamic masking / pseudonymisation; no raw production PII
  in lower environments; PII redaction in logs.
- **DLP (A.8.12):** DLP tooling across channels; secret scanning as code-path DLP.
- **Backup (A.8.13):** scheduled, encrypted, separated backups + **tested
  restores** with recorded recovery times; documented RPO.

## Network, cloud & resilience — A.8.20–A.8.23, A.5.23, A.8.14, A.5.30, A.5.7

- **Network (A.8.20–A.8.22):** architecture diagrams; firewalls/security groups/
  NACLs; TLS everywhere; **segregation** (VPCs, subnets, K8s NetworkPolicies,
  separate accounts).
- **Web filtering (A.8.23):** SWG/DNS filtering — for cloud-only shops, often
  egress filtering on build/runtime networks (may be partly N/A; record in SoA).
- **Cloud services (A.5.23):** cloud-security policy; **shared-responsibility**
  mapping; CSPM; documented **exit strategy**.
- **Redundancy (A.8.14) & ICT continuity (A.5.30):** multi-AZ/region; DR runbooks
  with **RTO/RPO** and **failover test logs**.
- **Threat intelligence (A.5.7):** vetted feeds (CISA, NVD, GitHub advisories)
  fed into patching and SIEM, with traceable defensive changes.

## Quick artifact → control table

| Artifact | Helps evidence |
| --- | --- |
| Branch protection + required reviews | A.8.32, A.8.31, A.8.28, A.5.18 |
| CI pipeline (SAST/DAST/test gates) | A.8.25, A.8.28, A.8.29, A.8.32 |
| SCA + dependency bots + lockfiles + SBOM | A.8.8, A.8.9 |
| Secret scanning + secret manager | A.8.24, A.5.17, A.8.12 |
| IaC + IaC misconfig scanning | A.8.9, A.8.19, A.8.20, A.8.22, A.5.23 |
| MFA / SSO / SCIM + access reviews | A.8.5, A.8.2, A.5.15, A.5.16, A.5.18 |
| Encryption config (TLS/at-rest/KMS) | A.8.24 |
| Logging / SIEM + WORM stores | A.8.15, A.8.16 |
| Backup + restore-test + DR runbook | A.8.13, A.8.14, A.5.30 |
| Security/policy docs (SDLC, access, crypto, change, retention) | the "documented policy" half of most controls |

*Primary sources in [`08-sources.md`](08-sources.md).*
