#!/usr/bin/env node
/*
 * eu-ai-act-scan.cjs — dependency-free signal scanner for the EU AI Act
 * compliance skill.
 *
 * It sweeps a directory (or file) for patterns that are RELEVANT to the EU AI
 * Act (Regulation (EU) 2024/1689) and groups them by area: AI/ML frameworks,
 * model identifiers, prohibited-practice keywords (Art. 5), high-risk domain
 * keywords (Annex III), GPAI / training signals (Ch. V), and transparency
 * signals (Art. 50).
 *
 * IMPORTANT: this is a heuristic that surfaces SIGNALS TO INVESTIGATE, not a
 * compliance determination. Code shows *use*, not legal *purpose*, *context*,
 * or *harm* — which is where the AI Act's tests actually turn. Always confirm
 * hits by reading the code in context, and treat the result as input to a human
 * (and, for anything load-bearing, legal) review. Not legal advice.
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
  '.cache', '.idea', '.gradle', 'bin', 'obj', 'Pods', 'DerivedData', '.terraform',
]);

// Large/auto-generated lockfiles: skip to cut noise and size.
const IGNORE_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'poetry.lock',
  'Cargo.lock', 'composer.lock', 'Gemfile.lock', 'go.sum',
]);

const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico', '.svg', '.pdf',
  '.zip', '.gz', '.tar', '.tgz', '.rar', '.7z', '.mp4', '.mov', '.avi', '.mp3',
  '.wav', '.flac', '.woff', '.woff2', '.ttf', '.otf', '.eot', '.so', '.dylib',
  '.dll', '.exe', '.bin', '.wasm', '.pt', '.pth', '.onnx', '.safetensors',
  '.ckpt', '.h5', '.pb', '.tflite', '.parquet', '.npy', '.npz', '.class',
  '.jar', '.pyc', '.o', '.a',
]);

// Each pattern is a heuristic signal. `regex` has NO global flag (stateless test).
const PATTERNS = [
  // --- AI/ML frameworks & SDKs -------------------------------------------
  { cat: 'frameworks', id: 'openai', note: 'OpenAI SDK / API', regex: /\bopenai\b/i },
  { cat: 'frameworks', id: 'anthropic', note: 'Anthropic / Claude SDK', regex: /(@anthropic-ai|\banthropic\b)/i },
  { cat: 'frameworks', id: 'google-genai', note: 'Google Generative AI / Vertex AI', regex: /\b(google-generativeai|google-genai|generativeai|vertexai|vertex-ai)\b/i },
  { cat: 'frameworks', id: 'cohere', note: 'Cohere SDK', regex: /\bcohere\b/i },
  { cat: 'frameworks', id: 'mistral', note: 'Mistral SDK', regex: /\bmistralai\b/i },
  { cat: 'frameworks', id: 'huggingface', note: 'Hugging Face / transformers', regex: /\b(huggingface|huggingface_hub|hf_hub|transformers|sentence-transformers)\b/i },
  { cat: 'frameworks', id: 'orchestration', note: 'LLM orchestration (LangChain/LlamaIndex/etc.)', regex: /\b(langchain|llama-?index|llamaindex|haystack|semantic-kernel)\b/i },
  { cat: 'frameworks', id: 'pytorch', note: 'PyTorch', regex: /\b(pytorch|torch)\b/i },
  { cat: 'frameworks', id: 'tensorflow', note: 'TensorFlow / Keras', regex: /\b(tensorflow|keras)\b/i },
  { cat: 'frameworks', id: 'classical-ml', note: 'Classical ML (scikit-learn/XGBoost/etc.)', regex: /\b(scikit-learn|sklearn|xgboost|lightgbm|catboost)\b/i },
  { cat: 'frameworks', id: 'runtimes', note: 'Inference runtimes (ONNX/vLLM/llama.cpp)', regex: /\b(onnxruntime|vllm|llama\.cpp|ggml|gguf)\b/i },
  { cat: 'frameworks', id: 'cloud-ml', note: 'Cloud model platforms (Bedrock/SageMaker/Azure/Replicate)', regex: /\b(bedrock|sagemaker|azure-?openai|azure\.ai|replicate)\b/i },

  // --- Model identifiers --------------------------------------------------
  { cat: 'modelIdentifiers', id: 'claude', note: 'Claude model id', regex: /\bclaude-[a-z0-9.\-]+/i },
  { cat: 'modelIdentifiers', id: 'gpt', note: 'GPT model id', regex: /\bgpt-[0-9o]/i },
  { cat: 'modelIdentifiers', id: 'gemini', note: 'Gemini model id', regex: /\bgemini-[a-z0-9.\-]/i },
  { cat: 'modelIdentifiers', id: 'open-models', note: 'Open-weight model id (Llama/Mistral/Mixtral/etc.)', regex: /\b(llama-?[0-9]|mistral-[a-z0-9]|mixtral|command-r|qwen|deepseek)\b/i },
  { cat: 'modelIdentifiers', id: 'media-models', note: 'Media model id (Whisper/Stable Diffusion/DALL-E/Flux)', regex: /\b(whisper|stable-diffusion|sdxl|dall-?e|flux\.1|text-embedding-)\b/i },

  // --- Prohibited practices (Art. 5) -------------------------------------
  { cat: 'prohibited', id: 'social-scoring', note: 'Art. 5(1)(c) social scoring', regex: /\b(social[\s_-]?scor|citizen[\s_-]?scor|trust[\s_-]?score|reputation[\s_-]?score)/i },
  { cat: 'prohibited', id: 'emotion-recognition', note: 'Art. 5(1)(f) emotion recognition (work/education)', regex: /\b(emotion|affect)[\s_-]?(recognition|detection|analysis|inference|classif)/i },
  { cat: 'prohibited', id: 'face-scraping', note: 'Art. 5(1)(e) untargeted facial-image scraping', regex: /(\bscrap\w*[\s_-]?(face|facial)|\b(face|facial)[\s_-]?(scrap|image[\s_-]?database)|facial[\s_-]?recognition[\s_-]?database)/i },
  { cat: 'prohibited', id: 'predictive-policing', note: 'Art. 5(1)(d) crime prediction by profiling', regex: /\b(predictive[\s_-]?policing|recidivism|re-?offend|crime[\s_-]?predict)/i },
  { cat: 'prohibited', id: 'biometric-categorization', note: 'Art. 5(1)(g) sensitive biometric categorisation', regex: /\bbiometric[\s_-]?categor/i },
  { cat: 'prohibited', id: 'subliminal', note: 'Art. 5(1)(a) subliminal/manipulative techniques', regex: /\bsubliminal\b/i },
  { cat: 'prohibited', id: 'realtime-rbi', note: 'Art. 5(1)(h) real-time remote biometric identification', regex: /\b(real-?time[\s_-]?(remote[\s_-]?)?biometric|live[\s_-]?facial[\s_-]?recognition)/i },
  { cat: 'prohibited', id: 'nudify', note: 'Pending Art. 5 NCII/CSAM ("nudifier") prohibition', regex: /\b(nudif\w*|deep-?nude)\b/i },

  // --- High-risk domains (Annex III) -------------------------------------
  { cat: 'highRiskDomain', id: 'employment', note: 'Annex III §4 employment / HR', regex: /\b((applicant|candidate|resume|cv)[\s_-]?(screen|rank|scor|select|filter)|recruit\w*[\s_-]?(ai|model|score|tool))/i },
  { cat: 'highRiskDomain', id: 'credit', note: 'Annex III §5(b) creditworthiness / credit scoring', regex: /\b(credit[\s_-]?scor|creditworth|loan[\s_-]?default[\s_-]?predict)/i },
  { cat: 'highRiskDomain', id: 'insurance', note: 'Annex III §5(c) life/health insurance risk & pricing', regex: /\binsurance[\s_-]?(risk|pricing|underwrit)/i },
  { cat: 'highRiskDomain', id: 'education', note: 'Annex III §3 education (admission/grading/proctoring)', regex: /\b(admission[\s_-]?(decision|scor)|grading[\s_-]?(model|algorithm)|proctor|exam[\s_-]?monitor)/i },
  { cat: 'highRiskDomain', id: 'biometric-id', note: 'Annex III §1 biometrics', regex: /\b(facial[\s_-]?recognition|face[\s_-]?match|fingerprint[\s_-]?match|iris[\s_-]?scan|biometric[\s_-]?(identif|verif))/i },
  { cat: 'highRiskDomain', id: 'migration', note: 'Annex III §7 migration / asylum / border', regex: /\b(asylum|visa[\s_-]?(decision|risk)|border[\s_-]?control|migration[\s_-]?risk)/i },
  { cat: 'highRiskDomain', id: 'critical-infra', note: 'Annex III §2 critical infrastructure', regex: /\b(critical[\s_-]?infrastructure|\bscada\b|grid[\s_-]?(control|management)|water[\s_-]?supply[\s_-]?control)/i },
  { cat: 'highRiskDomain', id: 'essential-services', note: 'Annex III §5 essential services / benefits / emergency', regex: /\b(benefit[\s_-]?eligibilit|welfare[\s_-]?fraud|emergency[\s_-]?(dispatch|triage))/i },
  { cat: 'highRiskDomain', id: 'justice', note: 'Annex III §8 justice / democratic processes', regex: /\b(case[\s_-]?law[\s_-]?predict|sentencing[\s_-]?(model|algorithm)|voter[\s_-]?(target|profil))/i },

  // --- GPAI / model training (Chapter V) ---------------------------------
  { cat: 'gpaiTraining', id: 'training', note: 'Model training / fine-tuning', regex: /\b(fine-?tun|finetun|pre-?train|pretrain|training[\s_-]?loop|model\.fit\b|trainer\(|num_epochs|n_epochs)/i },
  { cat: 'gpaiTraining', id: 'dataset', note: 'Training data / dataset pipeline', regex: /\b(training[\s_-]?(data|dataset|corpus)|data[\s_-]?loader|dataloader)\b/i },
  { cat: 'gpaiTraining', id: 'compute', note: 'Training compute / weights (systemic-risk threshold cues)', regex: /\b(flops?|floating[\s_-]?point[\s_-]?operations|model[\s_-]?weights|checkpoint)\b/i },

  // --- Transparency controls (Art. 50) -----------------------------------
  { cat: 'transparencyDisclosure', id: 'ai-disclosure', note: 'Art. 50(1)/(4) "this is AI" disclosure string', regex: /(ai-?generated|generated by ai|artificially generated|this is an ai|chatting with an ai|talking to an ai|powered by ai|ai assistant|ai-?chatbot)/i },
  { cat: 'transparencyDisclosure', id: 'provenance', note: 'Art. 50(2) machine-readable provenance / watermark', regex: /\b(c2pa|synthid|content[\s_-]?credentials|watermark|provenance[\s_-]?(metadata|signal))/i },
];

const CATEGORY_LABELS = {
  frameworks: 'AI/ML frameworks & SDKs',
  modelIdentifiers: 'Model identifiers',
  prohibited: 'Prohibited-practice signals (Art. 5)',
  highRiskDomain: 'High-risk domain signals (Annex III)',
  gpaiTraining: 'GPAI / training signals (Ch. V)',
  transparencyDisclosure: 'Transparency controls present (Art. 50)',
};

const CATEGORY_ORDER = [
  'prohibited', 'highRiskDomain', 'gpaiTraining', 'frameworks',
  'modelIdentifiers', 'transparencyDisclosure',
];

function trimLine(s) {
  const collapsed = s.replace(/\s+/g, ' ').trim();
  return collapsed.length > LIMITS.lineTextMax
    ? collapsed.slice(0, LIMITS.lineTextMax) + '…'
    : collapsed;
}

function looksBinary(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) {
    if (buf[i] === 0) return true;
  }
  return false;
}

// Pure matcher: record hits from one file's content into `acc`.
function scanContent(relPath, content, acc) {
  const lines = content.split(/\r?\n/);
  const scanLines = lines.length > LIMITS.maxLines ? lines.slice(0, LIMITS.maxLines) : lines;
  for (const p of PATTERNS) {
    if (!p.regex.test(content)) continue;
    let count = 0;
    for (let i = 0; i < scanLines.length && count < LIMITS.perPatternPerFile; i++) {
      if (p.regex.test(scanLines[i])) {
        if (!acc[p.cat]) acc[p.cat] = new Map();
        if (!acc[p.cat].has(p.id)) acc[p.cat].set(p.id, { id: p.id, note: p.note, hits: [] });
        acc[p.cat].get(p.id).hits.push({ file: relPath, line: i + 1, text: trimLine(scanLines[i]) });
        count++;
      }
    }
  }
}

function walk(root) {
  const acc = {};
  const stats = { scannedFiles: 0, skippedBinaryOrLarge: 0, skippedDirs: 0, truncated: false };
  const rootStat = fs.statSync(root);
  const baseDir = rootStat.isDirectory() ? root : path.dirname(root);

  const stack = rootStat.isDirectory()
    ? [{ dir: root, depth: 0 }]
    : [];

  if (!rootStat.isDirectory()) {
    scanOneFile(root, baseDir, acc, stats);
    return { acc, stats };
  }

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
        if (IGNORE_DIRS.has(ent.name) || ent.name.startsWith('.git')) {
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
  const base = path.basename(full);
  if (IGNORE_FILES.has(base)) return;
  if (BINARY_EXT.has(path.extname(full).toLowerCase())) {
    stats.skippedBinaryOrLarge++;
    return;
  }
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
  const rel = path.relative(baseDir, full) || base;
  scanContent(rel, buf.toString('utf8'), acc);
  stats.scannedFiles++;
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

function interpret(summary) {
  const out = [];
  const hasModel = summary.frameworks > 0 || summary.modelIdentifiers > 0;
  if (hasModel) {
    out.push('AI/ML usage detected — confirm the system meets the Art. 3(1) "AI system" definition (it infers outputs) rather than being plain deterministic logic. See references/01-scope-and-definitions.md.');
  } else {
    out.push('No obvious AI/ML framework or model identifier found. If there is genuinely no AI system or GPAI model, the AI Act largely does not apply — but verify against the Art. 3(1) definition before concluding.');
  }
  if (summary.prohibited > 0) {
    out.push('⚠ PROHIBITED-PRACTICE SIGNALS (Art. 5) found — investigate immediately. These are hard bans (fines up to €35M / 7% of global turnover). Confirm purpose/context with counsel. See references/03-prohibited-practices.md.');
  }
  if (summary.highRiskDomain > 0) {
    out.push('High-risk DOMAIN signals (Annex III) found — assess Art. 6 classification and the Art. 6(3) derogation; if high-risk, provider duties in Arts. 9–17, 43, 47–49, 71–73 apply. See references/04-high-risk-systems.md.');
  }
  if (summary.gpaiTraining > 0) {
    out.push('Model training / fine-tuning signals found — consider GPAI provider duties (Art. 53) and whether training compute could exceed the 10^25 FLOP systemic-risk threshold (Arts. 51 & 55). See references/05-gpai-models.md.');
  }
  if (hasModel) {
    if (summary.transparencyDisclosure > 0) {
      out.push('Article 50 transparency likely engaged; some disclosure/provenance strings WERE found — verify they actually cover every chatbot and generative output, at first interaction. See references/06-transparency-obligations.md.');
    } else {
      out.push('Article 50 transparency likely engaged, but NO "AI-generated" / "talking to an AI" / watermark / provenance strings were found — check for an Art. 50(1)/(2)/(4) disclosure gap. See references/06-transparency-obligations.md.');
    }
  }
  out.push('AI literacy (Art. 4) applies to providers and deployers of ANY AI system and is already in force (since 2 Feb 2025).');
  out.push('Mind the timeline: prohibitions (Feb 2025) and GPAI (Aug 2025) are in force; high-risk Annex III + Art. 50 apply from 2 Aug 2026 (the Digital Omnibus may postpone Annex III to 2 Dec 2027 — pending, not yet law). Re-verify dates per references/02-timeline-and-status.md.');
  return out;
}

function buildResult(target, acc, stats) {
  const summary = summarize(acc);
  const categories = {};
  for (const cat of Object.keys(CATEGORY_LABELS)) {
    if (acc[cat]) categories[cat] = Array.from(acc[cat].values());
  }
  return {
    tool: 'eu-ai-act-scan',
    version: VERSION,
    referenceSnapshot: '2026-06-22',
    target,
    scannedFiles: stats.scannedFiles,
    skipped: { binaryOrLarge: stats.skippedBinaryOrLarge, ignoredDirs: stats.skippedDirs },
    truncated: stats.truncated,
    summary,
    categories,
    interpretation: interpret(summary),
    disclaimer: 'Heuristic signals to investigate, NOT a compliance determination. Confirm every hit by reading the code in context. Not legal advice.',
  };
}

function renderText(result) {
  const L = [];
  L.push(`eu-ai-act-scan v${result.version}  (reference snapshot ${result.referenceSnapshot})`);
  L.push(`target: ${result.target}`);
  L.push(`scanned ${result.scannedFiles} files` + (result.truncated ? ' (TRUNCATED at file cap)' : '') + `, skipped ${result.skipped.binaryOrLarge} binary/large`);
  L.push('');
  L.push('Signal summary:');
  for (const cat of CATEGORY_ORDER) {
    L.push(`  ${result.summary[cat] > 0 ? '•' : ' '} ${CATEGORY_LABELS[cat]}: ${result.summary[cat]}`);
  }
  L.push('');
  for (const cat of CATEGORY_ORDER) {
    const items = result.categories[cat];
    if (!items || !items.length) continue;
    L.push(`## ${CATEGORY_LABELS[cat]}`);
    for (const it of items) {
      L.push(`  - ${it.id} — ${it.note}`);
      for (const h of it.hits) {
        L.push(`      ${h.file}:${h.line}  ${h.text}`);
      }
    }
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
  const fixtures = {
    'app/chatbot.py': [
      'from openai import OpenAI',
      'client = OpenAI()',
      'MODEL = "gpt-4o"',
      '# The banner tells the user they are chatting with an AI assistant.',
    ].join('\n'),
    'hr/screen.py': [
      'def score_resume(applicant):',
      '    # rank the candidate against the role',
      '    return model.predict(features)',
      '# experimental: emotion recognition of the interviewee',
    ].join('\n'),
    'train/run.py': [
      'from transformers import Trainer',
      'trainer = Trainer(model=base)',
      'model.fit(training_data, num_epochs=3)  # fine-tune on llama-2',
    ].join('\n'),
    'risk/credit.js': [
      '// credit scoring model used for loan approval decisions',
      'const score = creditworthiness(applicant);',
    ].join('\n'),
  };
  const acc = {};
  for (const [p, c] of Object.entries(fixtures)) scanContent(p, c, acc);
  const summary = summarize(acc);
  const expectations = [
    ['frameworks', summary.frameworks > 0],
    ['modelIdentifiers', summary.modelIdentifiers > 0],
    ['prohibited', summary.prohibited > 0],
    ['highRiskDomain', summary.highRiskDomain > 0],
    ['gpaiTraining', summary.gpaiTraining > 0],
    ['transparencyDisclosure', summary.transparencyDisclosure > 0],
  ];
  let failed = 0;
  for (const [name, ok] of expectations) {
    process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${name} detected (count=${summary[name]})\n`);
    if (!ok) failed++;
  }
  if (failed) {
    process.stdout.write(`\nself-test FAILED: ${failed} expectation(s) not met\n`);
    process.exit(1);
  }
  process.stdout.write('\nself-test passed: all signal categories detected\n');
}

// --------------------------------------------------------------------------
// CLI
// --------------------------------------------------------------------------
function usage() {
  return [
    `eu-ai-act-scan v${VERSION} — EU AI Act signal scanner (heuristic, not legal advice)`,
    '',
    'Usage:',
    '  node eu-ai-act-scan.cjs [--format text|json] scan <path>',
    '  node eu-ai-act-scan.cjs self-test',
    '  node eu-ai-act-scan.cjs --help',
    '',
    'Commands:',
    '  scan <path>   Recursively scan a directory (or a single file) for EU AI Act signals.',
    '  self-test     Run built-in fixtures and verify each signal category is detected.',
    '',
    'Options:',
    '  --format text|json   Output format (default: text).',
    '',
    'Output groups hits by area: prohibited practices (Art. 5), high-risk domains',
    '(Annex III), GPAI/training (Ch. V), AI/ML frameworks, model identifiers, and',
    'transparency controls (Art. 50). Every hit is a SIGNAL TO INVESTIGATE — confirm',
    'it in context. This tool does not determine compliance and is not legal advice.',
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

module.exports = { scanContent, summarize, interpret, PATTERNS, VERSION };
