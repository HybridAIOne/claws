#!/usr/bin/env node
/*
 * iso-27001-scan.cjs — dependency-free technical-evidence scanner for the
 * ISO/IEC 27001:2022 compliance skill.
 *
 * It sweeps a directory (or file) for signals relevant to the Annex A
 * TECHNOLOGICAL controls (A.8) and the technical half of a few organisational
 * controls (A.5), in two flavours:
 *   - EVIDENCE: capabilities that help satisfy a control (CI security scans,
 *     dependency/secret scanning, IaC, encryption, IAM/MFA, logging, backup…).
 *   - RISK: anti-patterns that indicate a likely gap (committed private keys,
 *     weak/legacy crypto, disabled TLS verification…).
 * Each signal is tagged with the Annex A control(s) it relates to.
 *
 * IMPORTANT LIMITS — read these into every report:
 *   1. A codebase audit covers a SUBSET of the ISMS. ISO 27001 certifies an
 *      organisation's whole management system, not a repo. People (A.6),
 *      physical (A.7) and most governance (A.5 + clauses 4-10) are invisible
 *      to this tool.
 *   2. Config != effectiveness. A present config proves a capability EXISTS,
 *      not that the process is operated. Pair every "evidence" hit with the
 *      operational records an auditor would want.
 * This is NOT an audit and NOT a certification. Not legal advice.
 *
 * No third-party dependencies; Node >= 16.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const VERSION = '0.1.0';

const LIMITS = {
  maxFiles: 20000,
  maxDepth: 12,
  maxBytes: 1.5 * 1024 * 1024,
  maxLines: 6000,
  perPatternPerFile: 3,
  lineTextMax: 160,
};

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.hg', '.svn', 'dist', 'build', 'out', 'target',
  'vendor', '.venv', 'venv', 'env', '__pycache__', '.next', '.nuxt', 'coverage',
  '.cache', '.idea', '.gradle', 'bin', 'obj', 'Pods', 'DerivedData',
]);

// Lockfiles: detect their PRESENCE (path pattern) but skip reading content.
const CONTENT_SKIP_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'poetry.lock',
  'Cargo.lock', 'composer.lock', 'Gemfile.lock', 'go.sum', 'Pipfile.lock',
]);

const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico', '.pdf', '.zip',
  '.gz', '.tar', '.tgz', '.rar', '.7z', '.mp4', '.mov', '.avi', '.mp3', '.wav',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.so', '.dylib', '.dll', '.exe',
  '.bin', '.wasm', '.class', '.jar', '.pyc', '.o', '.a', '.parquet',
]);

const CATEGORY_LABELS = {
  secureDev: 'Secure development & CI (A.8.25-A.8.31)',
  depVuln: 'Dependency & vulnerability mgmt (A.8.8)',
  secretsCrypto: 'Cryptography & secrets (A.8.24, A.5.17)',
  accessIdentity: 'Access control & identity (A.5.15-A.5.18, A.8.2/8.3/8.5)',
  logMonitor: 'Logging & monitoring (A.8.15-A.8.17)',
  iacConfig: 'Configuration & IaC (A.8.9, A.8.19-A.8.22)',
  backupResilience: 'Backup & resilience (A.8.13/8.14, A.5.30)',
  dataProtection: 'Data protection (A.8.10-A.8.12)',
  governanceDocs: 'Security policy & governance docs (A.5)',
  risks: 'RISK signals / anti-patterns (likely gaps)',
};

const EVIDENCE_ORDER = [
  'secureDev', 'depVuln', 'secretsCrypto', 'accessIdentity', 'logMonitor',
  'iacConfig', 'backupResilience', 'dataProtection', 'governanceDocs',
];

// Matched against the file's RELATIVE PATH. All evidence.
const PATH_PATTERNS = [
  { cat: 'secureDev', id: 'ci-workflow', controls: ['A.8.25', 'A.8.29', 'A.8.32'], note: 'CI/CD workflow', regex: /(^|\/)\.github\/workflows\/[^/]+\.ya?ml$/i },
  { cat: 'secureDev', id: 'gitlab-ci', controls: ['A.8.25', 'A.8.32'], note: 'GitLab CI pipeline', regex: /(^|\/)\.gitlab-ci\.ya?ml$/i },
  { cat: 'secureDev', id: 'codeql-cfg', controls: ['A.8.28', 'A.8.29'], note: 'CodeQL config', regex: /(^|\/)\.github\/codeql[^/]*$/i },
  { cat: 'secureDev', id: 'semgrep-cfg', controls: ['A.8.28'], note: 'Semgrep config', regex: /(^|\/)\.?semgrep\.ya?ml$/i },
  { cat: 'secureDev', id: 'codeowners', controls: ['A.8.28', 'A.5.18'], note: 'Code ownership / mandated review', regex: /(^|\/)CODEOWNERS$/ },
  { cat: 'secureDev', id: 'precommit', controls: ['A.8.28'], note: 'pre-commit hooks', regex: /(^|\/)\.pre-commit-config\.ya?ml$/i },
  { cat: 'depVuln', id: 'dependabot', controls: ['A.8.8'], note: 'Dependabot config', regex: /(^|\/)\.github\/dependabot\.ya?ml$/i },
  { cat: 'depVuln', id: 'renovate', controls: ['A.8.8'], note: 'Renovate config', regex: /(^|\/)(renovate\.json5?|\.renovaterc(\.json)?)$/i },
  { cat: 'depVuln', id: 'snyk-cfg', controls: ['A.8.8'], note: 'Snyk policy', regex: /(^|\/)\.snyk$/i },
  { cat: 'depVuln', id: 'trivy-cfg', controls: ['A.8.8'], note: 'Trivy config', regex: /(^|\/)(trivy\.ya?ml|\.trivyignore)$/i },
  { cat: 'depVuln', id: 'lockfile', controls: ['A.8.8', 'A.8.9'], note: 'Dependency lockfile (reproducible builds)', regex: /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.ya?ml|poetry\.lock|Pipfile\.lock|go\.sum|Cargo\.lock|composer\.lock|Gemfile\.lock)$/ },
  { cat: 'depVuln', id: 'sbom', controls: ['A.8.8'], note: 'SBOM artifact', regex: /(^|\/)(sbom|bom|cyclonedx|spdx)[^/]*\.(json|xml|spdx)$/i },
  { cat: 'secretsCrypto', id: 'gitleaks-cfg', controls: ['A.8.24', 'A.8.12'], note: 'gitleaks config', regex: /(^|\/)(\.gitleaks\.(toml|ya?ml)|\.gitleaksignore)$/i },
  { cat: 'secretsCrypto', id: 'secrets-baseline', controls: ['A.8.24'], note: 'detect-secrets baseline', regex: /(^|\/)\.secrets\.baseline$/i },
  { cat: 'iacConfig', id: 'terraform', controls: ['A.8.9', 'A.8.20', 'A.8.22'], note: 'Terraform IaC', regex: /\.tf$/i },
  { cat: 'iacConfig', id: 'pulumi', controls: ['A.8.9'], note: 'Pulumi IaC', regex: /(^|\/)Pulumi\.ya?ml$/i },
  { cat: 'iacConfig', id: 'dockerfile', controls: ['A.8.9', 'A.8.19'], note: 'Container image build', regex: /(^|\/)Dockerfile([.\-][^/]*)?$/ },
  { cat: 'iacConfig', id: 'helm-chart', controls: ['A.8.9'], note: 'Helm chart', regex: /(^|\/)Chart\.ya?ml$/i },
  { cat: 'governanceDocs', id: 'security-md', controls: ['A.5.1'], note: 'SECURITY.md policy', regex: /(^|\/)SECURITY\.md$/i },
  { cat: 'governanceDocs', id: 'security-docs', controls: ['A.5.1'], note: 'Security / ISMS documentation', regex: /(^|\/)(docs\/)?(security|isms|information[-_]security)[^/]*\.(md|adoc|rst)$/i },
];

// Matched against file CONTENT (line by line). `kind` is 'evidence' or 'risk'.
const CONTENT_PATTERNS = [
  // --- evidence ---
  { cat: 'secureDev', kind: 'evidence', id: 'sast', controls: ['A.8.28', 'A.8.29'], note: 'SAST tool', regex: /\b(codeql|semgrep|sonarqube|sonarcloud|bandit|gosec|brakeman|spotbugs)\b/i },
  { cat: 'depVuln', kind: 'evidence', id: 'sca', controls: ['A.8.8'], note: 'Dependency / SCA scanning', regex: /\b(snyk|trivy|grype|dependency-check|osv-scanner|dependabot|renovate|dependency-review)\b/i },
  { cat: 'secretsCrypto', kind: 'evidence', id: 'secret-scan', controls: ['A.8.24', 'A.8.12'], note: 'Secret scanning', regex: /\b(gitleaks|trufflehog|detect-secrets|git-secrets|ggshield)\b/i },
  { cat: 'secretsCrypto', kind: 'evidence', id: 'secret-mgr', controls: ['A.8.24', 'A.5.17'], note: 'Secrets manager', regex: /\b(hashicorp[_\s-]?vault|vault[_\s-]?(addr|token|kv)|secretsmanager|secret[_\s-]?manager|key[_\s-]?vault|keyvault|sealed[_\s-]?secrets|external-secrets|doppler)\b/i },
  { cat: 'secretsCrypto', kind: 'evidence', id: 'tls', controls: ['A.8.24'], note: 'TLS / certificates', regex: /\b(tlsv?1\.[23]|strict-transport-security|\bhsts\b|cert-manager|letsencrypt|acm_certificate)\b/i },
  { cat: 'secretsCrypto', kind: 'evidence', id: 'enc-at-rest', controls: ['A.8.24'], note: 'Encryption at rest', regex: /\b(server_side_encryption|sse[_-]?kms|storage_encrypted|kms_key_id|customer_managed_key|\bcmek\b|encrypted\s*[:=]\s*true)\b/i },
  { cat: 'accessIdentity', kind: 'evidence', id: 'mfa-sso', controls: ['A.8.5', 'A.5.16'], note: 'MFA / SSO / identity', regex: /\b(mfa|multi-?factor|\bsso\b|\boidc\b|\bsaml\b|\bscim\b|okta|entra|cognito)\b/i },
  { cat: 'accessIdentity', kind: 'evidence', id: 'rbac', controls: ['A.5.15', 'A.8.3', 'A.8.2'], note: 'RBAC / least privilege', regex: /\b(rbac|role-based access|\babac\b|least[_\s-]?privilege|\bopa\b|rego|cedar|casbin)\b/i },
  { cat: 'logMonitor', kind: 'evidence', id: 'logging-siem', controls: ['A.8.15', 'A.8.16'], note: 'Logging / SIEM', regex: /\b(cloudtrail|cloudwatch|opensearch|elasticsearch|logstash|splunk|datadog|\bloki\b|audit[_\s-]?log|\bsiem\b|guardduty)\b/i },
  { cat: 'logMonitor', kind: 'evidence', id: 'clock-sync', controls: ['A.8.17'], note: 'Clock synchronization', regex: /\b(\bntp\b|chrony|timesyncd|time[_\s-]?sync)\b/i },
  { cat: 'iacConfig', kind: 'evidence', id: 'iac-scan', controls: ['A.8.9'], note: 'IaC misconfig scanning', regex: /\b(tfsec|checkov|\bkics\b|terrascan|cloudsploit)\b/i },
  { cat: 'backupResilience', kind: 'evidence', id: 'backup', controls: ['A.8.13'], note: 'Backup', regex: /\b(aws_backup|backup_retention(_period)?|velero|restic|borgbackup|snapshot_retention)\b/i },
  { cat: 'backupResilience', kind: 'evidence', id: 'resilience', controls: ['A.8.14', 'A.5.30'], note: 'Redundancy / DR', regex: /\b(multi[_-]?az|read[_\s-]?replica|auto[_-]?scaling|failover|disaster[_\s-]?recovery|\brto\b|\brpo\b)\b/i },
  { cat: 'dataProtection', kind: 'evidence', id: 'data-protect', controls: ['A.8.11', 'A.8.10', 'A.8.12'], note: 'Data masking / retention / DLP', regex: /\b(data[_\s-]?masking|pseudonymi|anonymi|tokeniz|redact|lifecycle_rule|retention_policy|right[_\s-]?to[_\s-]?erasure|crypto-?shred)\b/i },

  // --- risk (anti-patterns) ---
  { cat: 'risks', kind: 'risk', id: 'private-key', controls: ['A.8.24', 'A.5.17'], note: 'Private key committed to the repo', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/ },
  { cat: 'risks', kind: 'risk', id: 'aws-key', controls: ['A.8.24'], note: 'Possible AWS access key id in source', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  // No leading \b: secrets are usually named DB_PASSWORD / API_KEY (snake_case),
  // where a \b before the keyword fails against the leading underscore.
  { cat: 'risks', kind: 'risk', id: 'hardcoded-secret', controls: ['A.8.24', 'A.5.17'], note: 'Possible hardcoded secret (verify; not env/placeholder)', regex: /(password|passwd|secret|api_?key|access_?token|client_?secret)\s*[:=]\s*["'][^"']{6,}["']/i, skipIf: /example|changeme|change-me|placeholder|your[_-]|xxxx|dummy|sample|redacted|\bnull\b|\bnone\b|<[^>]+>|\$\{|process\.env|os\.environ|getenv|secret(s)?[_-]?manager|vault|\benv\[/i },
  { cat: 'risks', kind: 'risk', id: 'weak-crypto', controls: ['A.8.24'], note: 'Legacy/weak crypto primitive — verify it is not used for security', regex: /\b(md5|sha1|\bdes\b|\brc4\b|\becb\b)\b/i },
  { cat: 'risks', kind: 'risk', id: 'tls-disabled', controls: ['A.8.24', 'A.8.21'], note: 'TLS / certificate verification disabled', regex: /(verify\s*=\s*False|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true|CURLOPT_SSL_VERIFY(?:PEER|HOST)\s*,\s*(?:0|false)|sslmode\s*=\s*disable|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*["']?0)/i },
  { cat: 'risks', kind: 'risk', id: 'debug-on', controls: ['A.8.9'], note: 'Debug mode enabled — verify it is not shipped to production', regex: /\b(DEBUG\s*=\s*True|FLASK_DEBUG\s*=\s*1)\b/ },
];

function trimLine(s) {
  const collapsed = s.replace(/\s+/g, ' ').trim();
  return collapsed.length > LIMITS.lineTextMax
    ? collapsed.slice(0, LIMITS.lineTextMax) + '…'
    : collapsed;
}

function looksBinary(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

function addHit(acc, p, hit) {
  if (!acc[p.cat]) acc[p.cat] = new Map();
  if (!acc[p.cat].has(p.id)) {
    acc[p.cat].set(p.id, { id: p.id, note: p.note, kind: p.kind || 'evidence', controls: p.controls, hits: [] });
  }
  acc[p.cat].get(p.id).hits.push(hit);
}

// Path-based evidence (the existence of the file is the signal).
function scanPath(relPath, acc) {
  for (const p of PATH_PATTERNS) {
    if (p.regex.test(relPath)) {
      addHit(acc, { ...p, kind: 'evidence' }, { file: relPath, line: 0, text: '(file present)' });
    }
  }
}

// Content-based evidence + risk signals.
function scanContent(relPath, content, acc) {
  const lines = content.split(/\r?\n/);
  const scanLines = lines.length > LIMITS.maxLines ? lines.slice(0, LIMITS.maxLines) : lines;
  for (const p of CONTENT_PATTERNS) {
    if (!p.regex.test(content)) continue;
    let count = 0;
    for (let i = 0; i < scanLines.length && count < LIMITS.perPatternPerFile; i++) {
      const line = scanLines[i];
      if (!p.regex.test(line)) continue;
      if (p.skipIf && p.skipIf.test(line)) continue;
      addHit(acc, p, { file: relPath, line: i + 1, text: trimLine(line) });
      count++;
    }
  }
}

function walk(root) {
  const acc = {};
  const stats = { scannedFiles: 0, skippedBinaryOrLarge: 0, skippedDirs: 0, truncated: false };
  const rootStat = fs.statSync(root);
  const baseDir = rootStat.isDirectory() ? root : path.dirname(root);

  if (!rootStat.isDirectory()) {
    scanOneFile(root, baseDir, acc, stats);
    return { acc, stats };
  }

  const stack = [{ dir: root, depth: 0 }];
  while (stack.length) {
    const { dir, depth } = stack.pop();
    if (depth > LIMITS.maxDepth) continue;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_e) {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isSymbolicLink()) continue;
      if (ent.isDirectory()) {
        // Skip VCS/build dirs but NOT .github / .gitlab (they hold real evidence).
        if (IGNORE_DIRS.has(ent.name)) {
          stats.skippedDirs++;
          continue;
        }
        stack.push({ dir: full, depth: depth + 1 });
      } else if (ent.isFile()) {
        if (stats.scannedFiles >= LIMITS.maxFiles) {
          stats.truncated = true;
          return { acc, stats };
        }
        scanOneFile(full, baseDir, acc, stats);
      }
    }
  }
  return { acc, stats };
}

function scanOneFile(full, baseDir, acc, stats) {
  const rel = path.relative(baseDir, full) || path.basename(full);
  // Path-based detection ALWAYS runs (even for lockfiles / large files).
  scanPath(rel, acc);
  stats.scannedFiles++;

  const base = path.basename(full);
  if (CONTENT_SKIP_FILES.has(base)) return;
  if (BINARY_EXT.has(path.extname(full).toLowerCase())) return;
  let st;
  try {
    st = fs.statSync(full);
  } catch (_e) {
    return;
  }
  if (st.size > LIMITS.maxBytes) {
    stats.skippedBinaryOrLarge++;
    return;
  }
  let buf;
  try {
    buf = fs.readFileSync(full);
  } catch (_e) {
    return;
  }
  if (looksBinary(buf)) {
    stats.skippedBinaryOrLarge++;
    return;
  }
  scanContent(rel, buf.toString('utf8'), acc);
}

function summarize(acc) {
  const summary = {};
  for (const cat of Object.keys(CATEGORY_LABELS)) {
    let n = 0;
    const m = acc[cat];
    if (m) for (const v of m.values()) n += v.hits.length;
    summary[cat] = n;
  }
  return summary;
}

function interpret(summary, acc) {
  const out = [];
  const evidenceCats = EVIDENCE_ORDER.filter((c) => summary[c] > 0);
  if (evidenceCats.length) {
    out.push(`Technical EVIDENCE found for ${evidenceCats.length} control area(s): ${evidenceCats.map((c) => CATEGORY_LABELS[c].replace(/\s*\(.*\)$/, '')).join(', ')}. Confirm each by reading the config/code in context — and pair it with operational records (config != an operated process).`);
  } else {
    out.push('No technical security evidence detected by the heuristics. Either the controls live elsewhere (cloud console, policies, CI settings not in this tree) or there are real gaps — verify by hand.');
  }
  if (summary.risks > 0) {
    const ids = acc.risks ? Array.from(acc.risks.values()).map((v) => v.id).join(', ') : '';
    out.push(`⚠ RISK SIGNALS found (${summary.risks} hit(s): ${ids}) — likely control gaps (A.8.24 cryptography/secrets and related). Triage these first; confirm each in context.`);
  }
  out.push('Scope boundary: this covers only the TECHNOLOGICAL subset (~A.8 + the technical half of a few A.5 controls). People (A.6), physical (A.7), and ISMS governance (most A.5 + clauses 4-10) need evidence this tool never sees — record them in the Statement of Applicability.');
  out.push('This is NOT an audit or certification. Target version is ISO/IEC 27001:2022 (+ Amd 1:2024); 2013 is withdrawn. See references/02-version-and-status.md.');
  return out;
}

function buildResult(target, acc, stats) {
  const summary = summarize(acc);
  const categories = {};
  for (const cat of Object.keys(CATEGORY_LABELS)) {
    if (acc[cat]) categories[cat] = Array.from(acc[cat].values());
  }
  return {
    tool: 'iso-27001-scan',
    version: VERSION,
    referenceSnapshot: '2026-06-22',
    standard: 'ISO/IEC 27001:2022 (+ Amd 1:2024)',
    target,
    scannedFiles: stats.scannedFiles,
    skipped: { binaryOrLarge: stats.skippedBinaryOrLarge, ignoredDirs: stats.skippedDirs },
    truncated: stats.truncated,
    summary,
    categories,
    interpretation: interpret(summary, acc),
    disclaimer: 'Heuristic signals to investigate, NOT an audit or certification. Config proves capability, not an operated process. Covers only the technical control subset. Not legal advice.',
  };
}

function renderItems(L, items) {
  for (const it of items) {
    L.push(`  - ${it.id} [${(it.controls || []).join(', ')}] — ${it.note}`);
    for (const h of it.hits) {
      L.push(`      ${h.file}${h.line ? ':' + h.line : ''}  ${h.text}`);
    }
  }
}

function renderText(result) {
  const L = [];
  L.push(`iso-27001-scan v${result.version}  (reference snapshot ${result.referenceSnapshot})`);
  L.push(`standard: ${result.standard}`);
  L.push(`target: ${result.target}`);
  L.push(`scanned ${result.scannedFiles} files` + (result.truncated ? ' (TRUNCATED at file cap)' : '') + `, skipped ${result.skipped.binaryOrLarge} binary/large`);
  L.push('');
  L.push('Signal summary:');
  for (const cat of EVIDENCE_ORDER) {
    L.push(`  ${result.summary[cat] > 0 ? '•' : ' '} ${CATEGORY_LABELS[cat]}: ${result.summary[cat]}`);
  }
  L.push(`  ${result.summary.risks > 0 ? '⚠' : ' '} ${CATEGORY_LABELS.risks}: ${result.summary.risks}`);
  L.push('');
  if (result.categories.risks) {
    L.push(`## ${CATEGORY_LABELS.risks}`);
    renderItems(L, result.categories.risks);
    L.push('');
  }
  for (const cat of EVIDENCE_ORDER) {
    const items = result.categories[cat];
    if (!items || !items.length) continue;
    L.push(`## ${CATEGORY_LABELS[cat]}`);
    renderItems(L, items);
    L.push('');
  }
  L.push('Interpretation:');
  for (const line of result.interpretation) L.push(`  - ${line}`);
  L.push('');
  L.push(result.disclaimer);
  return L.join('\n');
}

// --------------------------------------------------------------------------
// self-test
// --------------------------------------------------------------------------
function selfTest() {
  const acc = {};
  // path-based evidence
  scanPath('.github/workflows/ci.yml', acc);
  scanPath('.github/dependabot.yml', acc);
  scanPath('infra/main.tf', acc);
  scanPath('SECURITY.md', acc);
  // content-based evidence
  scanContent('.github/workflows/ci.yml', 'uses: github/codeql-action@v3\n- run: snyk test', acc);
  scanContent('infra/main.tf', 'server_side_encryption = "aws:kms"\nkms_key_id = var.key', acc);
  scanContent('infra/iam.tf', '# require mfa; oidc provider for sso', acc);
  scanContent('observability.tf', 'resource "aws_cloudtrail" "audit_log" {}', acc);
  // content-based risk
  scanContent('app/config.py', 'password = "hunter2-prod-value"', acc);     // should hit
  scanContent('app/safe.py', 'api_key = os.environ.get("API_KEY")', acc);   // skipIf -> should NOT hit
  scanContent('certs/server.pem', '-----BEGIN RSA PRIVATE KEY-----', acc);  // should hit
  scanContent('net/client.go', 'TLSClientConfig{ InsecureSkipVerify: true }', acc); // should hit

  const summary = summarize(acc);
  const riskMap = acc.risks || new Map();
  const hardcoded = riskMap.get('hardcoded-secret');
  const expectations = [
    ['secureDev evidence', summary.secureDev > 0],
    ['depVuln evidence', summary.depVuln > 0],
    ['secretsCrypto evidence', summary.secretsCrypto > 0],
    ['accessIdentity evidence', summary.accessIdentity > 0],
    ['logMonitor evidence', summary.logMonitor > 0],
    ['iacConfig evidence (path)', summary.iacConfig > 0],
    ['governanceDocs evidence (path)', summary.governanceDocs > 0],
    ['risk signals present', summary.risks > 0],
    ['private-key risk detected', riskMap.has('private-key')],
    ['tls-disabled risk detected', riskMap.has('tls-disabled')],
    ['hardcoded-secret detected exactly once (env line skipped)', !!hardcoded && hardcoded.hits.length === 1],
  ];
  let failed = 0;
  for (const [name, ok] of expectations) {
    process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${name}\n`);
    if (!ok) failed++;
  }
  if (failed) {
    process.stdout.write(`\nself-test FAILED: ${failed} expectation(s) not met\n`);
    process.exit(1);
  }
  process.stdout.write('\nself-test passed: evidence + risk detection and skipIf filtering all work\n');
}

// --------------------------------------------------------------------------
// CLI
// --------------------------------------------------------------------------
function usage() {
  return [
    `iso-27001-scan v${VERSION} — ISO/IEC 27001:2022 technical-evidence scanner (heuristic, not an audit)`,
    '',
    'Usage:',
    '  node iso-27001-scan.cjs [--format text|json] scan <path>',
    '  node iso-27001-scan.cjs self-test',
    '  node iso-27001-scan.cjs --help',
    '',
    'Commands:',
    '  scan <path>   Recursively scan a directory (or file) for ISO 27001 technical signals.',
    '  self-test     Run built-in fixtures and verify evidence + risk detection.',
    '',
    'Options:',
    '  --format text|json   Output format (default: text).',
    '',
    'Output groups EVIDENCE by control area (secure dev, dependency mgmt, crypto/secrets,',
    'access/identity, logging, IaC, backup, data protection, governance docs) and lists RISK',
    'anti-patterns, each tagged with Annex A control ids. It covers only the TECHNOLOGICAL',
    'subset of the ISMS; people, physical and governance controls are out of reach. A config',
    'proves capability, not an operated process. This is not an audit, not a certification,',
    'and not legal advice.',
  ].join('\n');
}

function main(argv) {
  const args = argv.slice(2);
  let format = 'text';
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--help' || a === '-h') {
      process.stdout.write(usage() + '\n');
      return 0;
    } else if (a === '--format') {
      format = (args[++i] || '').toLowerCase();
      if (format !== 'text' && format !== 'json') {
        process.stderr.write('error: --format must be "text" or "json"\n');
        return 2;
      }
    } else if (a === '--version' || a === '-v') {
      process.stdout.write(VERSION + '\n');
      return 0;
    } else {
      rest.push(a);
    }
  }

  const cmd = rest[0];
  if (!cmd) {
    process.stdout.write(usage() + '\n');
    return 0;
  }
  if (cmd === 'self-test') {
    selfTest();
    return 0;
  }
  if (cmd === 'scan') {
    const target = rest[1];
    if (!target) {
      process.stderr.write('error: scan requires a <path>\n');
      return 2;
    }
    let resolved;
    try {
      resolved = path.resolve(target);
      fs.statSync(resolved);
    } catch (_e) {
      process.stderr.write(`error: path not found: ${target}\n`);
      return 2;
    }
    const { acc, stats } = walk(resolved);
    const result = buildResult(resolved, acc, stats);
    if (format === 'json') {
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    } else {
      process.stdout.write(renderText(result) + '\n');
    }
    return 0;
  }
  process.stderr.write(`error: unknown command "${cmd}"\n\n` + usage() + '\n');
  return 2;
}

if (require.main === module) {
  process.exit(main(process.argv));
}

module.exports = { scanContent, scanPath, summarize, interpret, PATH_PATTERNS, CONTENT_PATTERNS, VERSION };
