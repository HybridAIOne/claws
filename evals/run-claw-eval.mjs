#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const EVALS_DIR = path.join(REPO_ROOT, 'evals');
const DEFAULT_CASE_FILE = path.join(EVALS_DIR, 'cases', 'agents.json');
const DEFAULT_FIXTURES_DIR = path.join(EVALS_DIR, 'fixtures');
const DEFAULT_RESULTS_ROOT = path.join(EVALS_DIR, 'results');
const DEFAULT_SANDBOX = 'host';
const DEFAULT_STARTUP_TIMEOUT_MS = 20_000;
const DEFAULT_CHAT_TIMEOUT_MS = 180_000;
const DEFAULT_CURRENT_RUNTIME_HOME =
  (process.env.HYBRIDCLAW_DATA_DIR || '').trim() ||
  path.join(os.homedir(), '.hybridclaw');

function usage() {
  console.log(`Usage:
  node evals/run-claw-eval.mjs <agent-id|source-dir|package.claw> [options]
  node evals/run-claw-eval.mjs --list

Options:
  --list                     List known agents with eval cases
  --rebuild                  Run ./build.sh before evaluating a repo agent
  --skip-externals           Install the agent with --skip-externals
  --model <name>             Override the model used for eval chat requests
  --chatbot-id <id>          Override the chatbot id used for eval chat requests
  --sandbox <host|container> Sandbox mode for gateway start (default: host)
  --results-dir <path>       Root directory for eval outputs
  --case-file <path>         Override the case catalog JSON
  --hybridclaw <path>        Override the hybridclaw executable path
  --startup-timeout-ms <n>   Gateway startup timeout in ms (default: 20000)
  --chat-timeout-ms <n>      Per-task chat timeout in ms (default: 180000)`);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    selector: '',
    list: false,
    rebuild: false,
    skipExternals: false,
    model: '',
    chatbotId: '',
    sandbox: DEFAULT_SANDBOX,
    resultsRoot: DEFAULT_RESULTS_ROOT,
    caseFile: DEFAULT_CASE_FILE,
    hybridclawBin: 'hybridclaw',
    startupTimeoutMs: DEFAULT_STARTUP_TIMEOUT_MS,
    chatTimeoutMs: DEFAULT_CHAT_TIMEOUT_MS,
  };

  while (args.length > 0) {
    const arg = args.shift();
    if (!arg) continue;
    if (arg === '--list') {
      options.list = true;
      continue;
    }
    if (arg === '--rebuild') {
      options.rebuild = true;
      continue;
    }
    if (arg === '--skip-externals') {
      options.skipExternals = true;
      continue;
    }
    if (arg === '--model') {
      options.model = String(args.shift() || '').trim();
      continue;
    }
    if (arg === '--chatbot-id') {
      options.chatbotId = String(args.shift() || '').trim();
      continue;
    }
    if (arg === '--sandbox') {
      options.sandbox = String(args.shift() || '').trim() || DEFAULT_SANDBOX;
      continue;
    }
    if (arg === '--results-dir') {
      options.resultsRoot = path.resolve(String(args.shift() || '').trim());
      continue;
    }
    if (arg === '--case-file') {
      options.caseFile = path.resolve(String(args.shift() || '').trim());
      continue;
    }
    if (arg === '--hybridclaw') {
      options.hybridclawBin = String(args.shift() || '').trim() || 'hybridclaw';
      continue;
    }
    if (arg === '--startup-timeout-ms') {
      options.startupTimeoutMs = Number.parseInt(String(args.shift() || ''), 10);
      continue;
    }
    if (arg === '--chat-timeout-ms') {
      options.chatTimeoutMs = Number.parseInt(String(args.shift() || ''), 10);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (!options.selector) {
      options.selector = arg;
      continue;
    }
    throw new Error(`Unexpected extra argument: ${arg}`);
  }

  if (options.sandbox !== 'host' && options.sandbox !== 'container') {
    throw new Error(`Invalid sandbox mode: ${options.sandbox}`);
  }
  if (!Number.isFinite(options.startupTimeoutMs) || options.startupTimeoutMs < 1) {
    throw new Error('startup timeout must be a positive integer');
  }
  if (!Number.isFinite(options.chatTimeoutMs) || options.chatTimeoutMs < 1) {
    throw new Error('chat timeout must be a positive integer');
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, 'utf-8');
}

function slugify(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function sanitizeAgentWorkspaceId(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'agent';
}

function safeSessionFilename(sessionId) {
  return String(sessionId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'session';
}

function nowTag() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    '-',
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
  ].join('');
}

function runCommandSync(command, args, options = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd || REPO_ROOT,
    env: options.env || process.env,
    encoding: 'utf-8',
  });
  return {
    command,
    args,
    cwd: options.cwd || REPO_ROOT,
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    durationMs: Date.now() - startedAt,
    error: result.error ? String(result.error.message || result.error) : null,
  };
}

function assertCommandOk(step, commandResult) {
  if (commandResult.code === 0 && !commandResult.error) return;
  throw new Error(
    `${step} failed (code ${commandResult.code ?? 'null'}): ${
      commandResult.error || commandResult.stderr.trim() || commandResult.stdout.trim() || 'unknown error'
    }`,
  );
}

function discoverRepoAgents() {
  const srcDir = path.join(REPO_ROOT, 'src');
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const agents = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sourceDir = path.join(srcDir, entry.name);
    const manifestPath = path.join(sourceDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    agents.push({
      dirName: entry.name,
      sourceDir,
      manifestPath,
      manifest,
      packagePath: path.join(REPO_ROOT, 'dist', `${entry.name}.claw`),
    });
  }
  return agents;
}

function extractManifestFromClaw(packagePath) {
  const unzipResult = runCommandSync('unzip', ['-p', packagePath, 'manifest.json']);
  assertCommandOk('manifest extraction', unzipResult);
  return JSON.parse(unzipResult.stdout);
}

function resolveTarget(selector, agents) {
  const asPath = path.resolve(selector);
  if (fs.existsSync(asPath) && fs.statSync(asPath).isFile() && asPath.endsWith('.claw')) {
    const manifest = extractManifestFromClaw(asPath);
    const repoMatch = agents.find((agent) => agent.manifest.id === manifest.id);
    return {
      manifest,
      manifestId: manifest.id,
      packagePath: asPath,
      sourceDir: repoMatch?.sourceDir || null,
      dirName: repoMatch?.dirName || path.basename(asPath, '.claw'),
    };
  }

  const byId = agents.find((agent) => agent.manifest.id === selector);
  if (byId) {
    return {
      manifest: byId.manifest,
      manifestId: byId.manifest.id,
      packagePath: byId.packagePath,
      sourceDir: byId.sourceDir,
      dirName: byId.dirName,
    };
  }

  const byDir = agents.find((agent) => agent.dirName === selector);
  if (byDir) {
    return {
      manifest: byDir.manifest,
      manifestId: byDir.manifest.id,
      packagePath: byDir.packagePath,
      sourceDir: byDir.sourceDir,
      dirName: byDir.dirName,
    };
  }

  throw new Error(`Could not resolve agent selector: ${selector}`);
}

function ensurePackage(target, rebuild, env, hybridclawBin) {
  if (rebuild || !fs.existsSync(target.packagePath)) {
    if (!target.sourceDir) {
      throw new Error(`Package ${target.packagePath} does not exist and no source directory is available to rebuild it.`);
    }
    const buildResult = runCommandSync(path.join(REPO_ROOT, 'build.sh'), [], {
      cwd: REPO_ROOT,
      env,
    });
    const logDir = path.join(DEFAULT_RESULTS_ROOT, '.last-build-log');
    writeText(path.join(logDir, 'stdout.log'), buildResult.stdout);
    writeText(path.join(logDir, 'stderr.log'), buildResult.stderr);
    assertCommandOk('build.sh', buildResult);
  }

  if (!fs.existsSync(target.packagePath)) {
    throw new Error(`Expected package not found at ${target.packagePath}`);
  }

  const whichResult = runCommandSync('which', [hybridclawBin], { env });
  assertCommandOk('hybridclaw lookup', whichResult);
  return whichResult.stdout.trim();
}

function loadCases(caseFile) {
  if (!fs.existsSync(caseFile)) {
    throw new Error(`Case catalog not found: ${caseFile}`);
  }
  return readJson(caseFile);
}

function validateCaseFixtures(cases) {
  const errors = [];
  for (const [agentId, caseSet] of Object.entries(cases || {})) {
    const tasks = Array.isArray(caseSet?.tasks) ? caseSet.tasks : [];
    for (const task of tasks) {
      const taskId = String(task?.id || '').trim() || 'task';
      const fixtureSpecs = Array.isArray(task?.fixtures) ? task.fixtures : [];
      for (const spec of fixtureSpecs) {
        try {
          const fixturePath = ensureRelativeFixturePath(spec);
          if (!fs.existsSync(fixturePath) || !fs.statSync(fixturePath).isFile()) {
            errors.push(`${agentId}/${taskId}: missing fixture ${spec}`);
          }
        } catch (error) {
          errors.push(
            `${agentId}/${taskId}: invalid fixture ${spec} (${error instanceof Error ? error.message : String(error)})`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Case fixture validation failed:\n- ${errors.join('\n- ')}`);
  }
}

function listKnownAgents(agents, cases) {
  const rows = agents
    .map((agent) => ({
      id: agent.manifest.id,
      dirName: agent.dirName,
      name: agent.manifest.name,
      tasks: Array.isArray(cases[agent.manifest.id]?.tasks)
        ? cases[agent.manifest.id].tasks.length
        : 0,
    }))
    .sort((left, right) => left.id.localeCompare(right.id));

  for (const row of rows) {
    console.log(`${row.id}\t${row.dirName}\t${row.tasks}\t${row.name}`);
  }
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Failed to allocate a TCP port')));
        return;
      }
      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

function copyIfExists(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) return false;
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  return true;
}

function ensureRelativeFixturePath(relativePath) {
  const normalized = String(relativePath || '').trim();
  if (!normalized) {
    throw new Error('Fixture path cannot be empty.');
  }
  if (path.isAbsolute(normalized)) {
    throw new Error(`Fixture path must be relative, got: ${normalized}`);
  }
  const resolved = path.resolve(DEFAULT_FIXTURES_DIR, normalized);
  if (!resolved.startsWith(path.resolve(DEFAULT_FIXTURES_DIR) + path.sep) && resolved !== path.resolve(DEFAULT_FIXTURES_DIR)) {
    throw new Error(`Fixture path escapes evals/fixtures: ${normalized}`);
  }
  return resolved;
}

function stageTaskFixtures(task, taskId, workspacePath) {
  const fixtureSpecs = Array.isArray(task.fixtures) ? task.fixtures : [];
  const staged = [];
  if (fixtureSpecs.length === 0) return staged;

  const workspaceFixtureDir = path.join(workspacePath, 'inputs', 'evals', taskId);
  fs.mkdirSync(workspaceFixtureDir, { recursive: true });

  for (const spec of fixtureSpecs) {
    const relativeSpec = String(spec || '').trim();
    if (!relativeSpec) continue;
    const sourcePath = ensureRelativeFixturePath(relativeSpec);
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      throw new Error(`Fixture file not found: ${sourcePath}`);
    }
    const targetPath = path.join(workspaceFixtureDir, path.basename(sourcePath));
    fs.copyFileSync(sourcePath, targetPath);
    staged.push({
      sourcePath,
      targetPath,
    });
  }

  return staged;
}

function prepareRuntime(runtimeDir, port) {
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.mkdirSync(path.join(runtimeDir, 'data'), { recursive: true });
  const sourceConfigPath = path.join(DEFAULT_CURRENT_RUNTIME_HOME, 'config.json');
  const targetConfigPath = path.join(runtimeDir, 'config.json');
  const sourceCredentialsPath = path.join(DEFAULT_CURRENT_RUNTIME_HOME, 'credentials.json');
  const targetCredentialsPath = path.join(runtimeDir, 'credentials.json');
  const sourceCodexAuthPath = path.join(DEFAULT_CURRENT_RUNTIME_HOME, 'codex-auth.json');
  const targetCodexAuthPath = path.join(runtimeDir, 'codex-auth.json');

  copyIfExists(sourceCredentialsPath, targetCredentialsPath);
  copyIfExists(sourceCodexAuthPath, targetCodexAuthPath);

  const config = fs.existsSync(sourceConfigPath) ? readJson(sourceConfigPath) : {};
  config.skills = {
    ...(config.skills || {}),
    extraDirs: [],
  };
  config.ops = {
    ...(config.ops || {}),
    healthPort: port,
    gatewayBaseUrl: `http://127.0.0.1:${port}`,
    dbPath: path.join(runtimeDir, 'data', 'hybridclaw.db'),
  };
  writeJson(targetConfigPath, config);
}

async function waitForHealth(baseUrl, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return await response.json();
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Gateway did not become healthy within ${timeoutMs}ms (${lastError || 'no response'})`);
}

async function waitForFile(filePath, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return fs.existsSync(filePath);
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const detail =
      payload && typeof payload === 'object' && typeof payload.error === 'string'
        ? payload.error
        : typeof payload === 'string'
          ? payload
          : `${response.status} ${response.statusText}`;
    throw new Error(detail);
  }
  return payload;
}

function summarizeToolExecutions(toolExecutions) {
  const executions = Array.isArray(toolExecutions) ? toolExecutions : [];
  const blocked = executions.filter(
    (entry) => entry?.blocked === true || entry?.approvalDecision === 'required' || entry?.approvalDecision === 'denied',
  ).length;
  const failed = executions.filter((entry) => entry?.isError === true).length;
  const succeeded = executions.filter(
    (entry) => entry?.isError !== true && entry?.blocked !== true && entry?.approvalDecision !== 'required' && entry?.approvalDecision !== 'denied',
  ).length;
  return {
    total: executions.length,
    succeeded,
    failed,
    blocked,
    successPct: executions.length > 0 ? Number(((succeeded / executions.length) * 100).toFixed(1)) : null,
  };
}

const TEXT_ARTIFACT_FORMATS = new Set([
  'text',
  'md',
  'txt',
  'html',
  'json',
  'csv',
  'yaml',
  'yml',
  'xml',
  'eml',
  'ics',
  'diff',
  'patch',
]);

const OOXML_REQUIRED_ENTRIES = {
  docx: ['[Content_Types].xml', 'word/document.xml'],
  xlsx: ['[Content_Types].xml', 'xl/workbook.xml'],
  pptx: ['[Content_Types].xml', 'ppt/presentation.xml'],
};

function inferArtifactFormat(task) {
  const explicit = String(task?.artifactFormat || '').trim().toLowerCase();
  if (explicit) return explicit;

  const ext = path.extname(String(task?.artifactPath || '')).toLowerCase();
  if (ext === '.md') return 'md';
  if (ext === '.txt') return 'txt';
  if (ext === '.html' || ext === '.htm') return 'html';
  if (ext === '.json') return 'json';
  if (ext === '.csv') return 'csv';
  if (ext === '.yaml' || ext === '.yml') return 'yaml';
  if (ext === '.xml') return 'xml';
  if (ext === '.eml') return 'eml';
  if (ext === '.ics') return 'ics';
  if (ext === '.diff') return 'diff';
  if (ext === '.patch') return 'patch';
  if (ext === '.docx') return 'docx';
  if (ext === '.xlsx') return 'xlsx';
  if (ext === '.pptx') return 'pptx';
  return 'text';
}

function unzipEntryList(filePath) {
  const result = runCommandSync('unzip', ['-Z1', filePath]);
  if (result.code !== 0 || result.error) {
    return {
      entries: [],
      error: result.error || result.stderr.trim() || result.stdout.trim() || 'Failed to inspect archive entries.',
    };
  }
  return {
    entries: result.stdout.split('\n').map((line) => line.trim()).filter(Boolean),
    error: null,
  };
}

function validateArtifact(task, artifactPath) {
  const format = inferArtifactFormat(task);
  const validation = {
    format,
    exists: false,
    sizeBytes: 0,
    missingStrings: [],
    missingJsonKeys: [],
    missingCsvHeaders: [],
    missingArchiveEntries: [],
    validationErrors: [],
  };

  if (!fs.existsSync(artifactPath)) {
    validation.missingStrings = [...(task.requiredArtifactStrings || [])];
    validation.missingJsonKeys = [...(task.requiredJsonKeys || [])];
    validation.missingCsvHeaders = [...(task.requiredCsvHeaders || [])];
    validation.missingArchiveEntries = [
      ...(
        task.requiredArchiveEntries ||
        OOXML_REQUIRED_ENTRIES[format] ||
        []
      ),
    ];
    return validation;
  }

  validation.exists = true;
  validation.sizeBytes = fs.statSync(artifactPath).size;

  if (OOXML_REQUIRED_ENTRIES[format]) {
    const { entries, error } = unzipEntryList(artifactPath);
    if (error) {
      validation.validationErrors.push(`Archive inspection failed: ${error}`);
      return validation;
    }
    const requiredEntries = [
      ...new Set([
        ...OOXML_REQUIRED_ENTRIES[format],
        ...(task.requiredArchiveEntries || []),
      ]),
    ];
    validation.missingArchiveEntries = requiredEntries.filter(
      (entry) => !entries.includes(entry),
    );
    if (validation.sizeBytes < 500) {
      validation.validationErrors.push(
        `Artifact is unexpectedly small for a .${format} file (${validation.sizeBytes} bytes).`,
      );
    }
    return validation;
  }

  if (!TEXT_ARTIFACT_FORMATS.has(format)) {
    return validation;
  }

  let content = '';
  try {
    content = fs.readFileSync(artifactPath, 'utf-8');
  } catch (error) {
    validation.validationErrors.push(
      `Artifact could not be read as UTF-8 text: ${error instanceof Error ? error.message : String(error)}`,
    );
    return validation;
  }

  validation.missingStrings = (task.requiredArtifactStrings || []).filter(
    (needle) => !content.includes(needle),
  );

  if (format === 'json' && Array.isArray(task.requiredJsonKeys) && task.requiredJsonKeys.length > 0) {
    try {
      const parsed = JSON.parse(content);
      validation.missingJsonKeys = task.requiredJsonKeys.filter(
        (key) =>
          !parsed ||
          typeof parsed !== 'object' ||
          Array.isArray(parsed) ||
          !(key in parsed),
      );
    } catch (error) {
      validation.validationErrors.push(
        `Artifact is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (format === 'csv' && Array.isArray(task.requiredCsvHeaders) && task.requiredCsvHeaders.length > 0) {
    const firstLine = content.split(/\r?\n/, 1)[0] || '';
    const headers = firstLine
      .split(',')
      .map((header) => header.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
    validation.missingCsvHeaders = task.requiredCsvHeaders.filter(
      (header) => !headers.includes(header),
    );
  }

  return validation;
}

function describeArtifactProblems(artifact) {
  const problems = [];
  if (artifact.missingStrings.length > 0) {
    problems.push(`missing strings: ${artifact.missingStrings.join(', ')}`);
  }
  if (artifact.missingJsonKeys.length > 0) {
    problems.push(`missing JSON keys: ${artifact.missingJsonKeys.join(', ')}`);
  }
  if (artifact.missingCsvHeaders.length > 0) {
    problems.push(`missing CSV headers: ${artifact.missingCsvHeaders.join(', ')}`);
  }
  if (artifact.missingArchiveEntries.length > 0) {
    problems.push(`missing archive entries: ${artifact.missingArchiveEntries.join(', ')}`);
  }
  if (artifact.validationErrors.length > 0) {
    problems.push(...artifact.validationErrors);
  }
  return problems;
}

function tailText(value, maxChars = 4_000) {
  const text = String(value || '');
  if (text.length <= maxChars) return text;
  return text.slice(text.length - maxChars);
}

function buildSummary(health) {
  const lines = [
    `# Eval Summary: ${health.agent.name} (${health.agent.id})`,
    '',
    `- Package: ${health.package.path}`,
    `- HybridClaw: ${health.hybridclaw.version || 'unknown'}`,
    `- Results: ${health.paths.resultDir}`,
    `- Install: ${health.install.success ? 'pass' : 'fail'}`,
    `- Gateway: ${health.gateway.success ? 'pass' : 'fail'}`,
    `- Tasks: ${health.tasks.passed}/${health.tasks.total} passed (${health.tasks.passPct}%)`,
    `- Successful commands: ${
      health.tasks.commandMetrics.successPct == null
        ? 'n/a'
        : `${health.tasks.commandMetrics.succeeded}/${health.tasks.commandMetrics.total} (${health.tasks.commandMetrics.successPct}%)`
    }`,
    '',
    '## Tasks',
  ];

  for (const task of health.tasks.items) {
    lines.push(`- ${task.id}: ${task.passed ? 'pass' : 'fail'}`);
    lines.push(`  artifact: ${task.artifact.exists ? task.artifact.savedCopyPath || task.artifact.path : 'missing'}`);
    lines.push(`  transcript: ${task.transcript.savedCopyPath || 'missing'}`);
    lines.push(
      `  commands: ${
        task.commandMetrics.successPct == null
          ? 'n/a'
          : `${task.commandMetrics.succeeded}/${task.commandMetrics.total} (${task.commandMetrics.successPct}%)`
      }`,
    );
    if (task.error) lines.push(`  error: ${task.error}`);
  }

  return `${lines.join('\n')}\n`;
}

async function stopGatewayProcess(child) {
  if (!child || child.exitCode != null || child.killed) return;
  child.kill('SIGTERM');
  const waited = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 5_000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
  if (waited) return;
  child.kill('SIGKILL');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const agents = discoverRepoAgents();
  const cases = loadCases(options.caseFile);
  validateCaseFixtures(cases);

  if (options.list) {
    listKnownAgents(agents, cases);
    return;
  }

  if (!options.selector) {
    usage();
    throw new Error('Missing agent selector');
  }

  const target = resolveTarget(options.selector, agents);
  const caseSet = cases[target.manifestId];
  if (!caseSet || !Array.isArray(caseSet.tasks) || caseSet.tasks.length === 0) {
    throw new Error(`No eval cases configured for agent ${target.manifestId}`);
  }

  const resultDir = path.join(
    options.resultsRoot,
    `${nowTag()}-${slugify(target.manifestId)}`,
  );
  const logsDir = path.join(resultDir, 'logs');
  const promptsDir = path.join(resultDir, 'prompts');
  const rawDir = path.join(resultDir, 'raw');
  const transcriptsDir = path.join(resultDir, 'transcripts');
  const artifactsDir = path.join(resultDir, 'artifacts');
  const runtimeDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `claw-eval-runtime-${slugify(target.manifestId)}-`),
  );
  fs.mkdirSync(logsDir, { recursive: true });
  fs.mkdirSync(promptsDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(transcriptsDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });

  const port = await getFreePort();
  prepareRuntime(runtimeDir, port);
  const gatewayToken = crypto.randomBytes(24).toString('hex');
  const env = {
    ...process.env,
    HOME: runtimeDir,
    HYBRIDCLAW_DATA_DIR: runtimeDir,
    HYBRIDCLAW_DISABLE_CONFIG_WATCHER: '1',
    HYBRIDCLAW_ACCEPT_TRUST: 'true',
    HYBRIDCLAW_FORCE_LOG_LEVEL: 'info',
    GATEWAY_API_TOKEN: gatewayToken,
  };
  const hybridclawBin = ensurePackage(target, options.rebuild, env, options.hybridclawBin);
  const gatewayBaseUrl = `http://127.0.0.1:${port}`;
  const evalAgentId = target.manifest.id;
  const workspacePath = path.join(
    runtimeDir,
    'data',
    'agents',
    sanitizeAgentWorkspaceId(evalAgentId),
    'workspace',
  );

  const health = {
    startedAt: new Date().toISOString(),
    finishedAt: null,
    agent: {
      id: evalAgentId,
      name: target.manifest.name,
      sourceDir: target.sourceDir,
    },
    package: {
      path: target.packagePath,
      manifest: target.manifest,
    },
    paths: {
      resultDir,
      runtimeDir,
      workspacePath,
      gatewayBaseUrl,
    },
    hybridclaw: {
      installed: true,
      bin: hybridclawBin,
      version: null,
      requestedModel: options.model || null,
      requestedChatbotId: options.chatbotId || null,
    },
    inspect: {
      success: false,
      logPaths: {
        stdout: path.join(logsDir, 'inspect.stdout.log'),
        stderr: path.join(logsDir, 'inspect.stderr.log'),
      },
    },
    install: {
      success: false,
      skipExternals: options.skipExternals,
      logPaths: {
        stdout: path.join(logsDir, 'install.stdout.log'),
        stderr: path.join(logsDir, 'install.stderr.log'),
      },
    },
    gateway: {
      success: false,
      logPath: path.join(logsDir, 'gateway.log'),
      health: null,
    },
    tasks: {
      total: caseSet.tasks.length,
      passed: 0,
      passPct: 0,
      commandMetrics: {
        total: 0,
        succeeded: 0,
        failed: 0,
        blocked: 0,
        successPct: null,
      },
      items: [],
    },
    error: null,
  };

  let gatewayChild = null;

  try {
    const versionResult = runCommandSync(hybridclawBin, ['-v'], { env, cwd: REPO_ROOT });
    if (versionResult.code === 0) {
      health.hybridclaw.version = versionResult.stdout.trim() || versionResult.stderr.trim() || null;
    }

    const inspectResult = runCommandSync(
      hybridclawBin,
      ['agent', 'inspect', target.packagePath],
      { env, cwd: REPO_ROOT },
    );
    writeText(health.inspect.logPaths.stdout, inspectResult.stdout);
    writeText(health.inspect.logPaths.stderr, inspectResult.stderr);
    assertCommandOk('hybridclaw agent inspect', inspectResult);
    health.inspect.success = true;

    const installArgs = [
      'agent',
      'install',
      target.packagePath,
      '--id',
      evalAgentId,
      '--force',
      '--yes',
      '--skip-skill-scan',
    ];
    if (options.skipExternals) {
      installArgs.push('--skip-externals');
    }
    const installResult = runCommandSync(hybridclawBin, installArgs, {
      env,
      cwd: REPO_ROOT,
    });
    writeText(health.install.logPaths.stdout, installResult.stdout);
    writeText(health.install.logPaths.stderr, installResult.stderr);
    assertCommandOk('hybridclaw agent install', installResult);
    health.install.success = true;

    const gatewayLogStream = fs.createWriteStream(health.gateway.logPath, {
      flags: 'a',
    });
    gatewayChild = spawn(
      hybridclawBin,
      ['gateway', 'start', '--foreground', `--sandbox=${options.sandbox}`],
      {
        cwd: REPO_ROOT,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    gatewayChild.stdout.on('data', (chunk) => gatewayLogStream.write(chunk));
    gatewayChild.stderr.on('data', (chunk) => gatewayLogStream.write(chunk));

    const exitDuringStartup = new Promise((_, reject) => {
      gatewayChild.once('exit', (code, signal) => {
        reject(
          new Error(
            `Gateway exited during startup (code ${code ?? 'null'}, signal ${signal ?? 'none'}).\n${tailText(fs.existsSync(health.gateway.logPath) ? fs.readFileSync(health.gateway.logPath, 'utf-8') : '')}`,
          ),
        );
      });
    });

    const gatewayHealth = await Promise.race([
      waitForHealth(gatewayBaseUrl, options.startupTimeoutMs),
      exitDuringStartup,
    ]);
    health.gateway.success = true;
    health.gateway.health = gatewayHealth;

    for (const task of caseSet.tasks) {
      const taskId = slugify(task.id);
      const promptPath = path.join(promptsDir, `${taskId}.md`);
      writeText(promptPath, task.prompt);

      const sessionId = `eval-${taskId}-${Date.now()}`;
      const transcriptSourcePath = path.join(
        workspacePath,
        '.session-transcripts',
        `${safeSessionFilename(sessionId)}.jsonl`,
      );
      const auditTranscriptSourcePath = path.join(
        runtimeDir,
        'data',
        'audit',
        sessionId,
        'wire.jsonl',
      );
      const artifactSourcePath = path.join(workspacePath, task.artifactPath);

      const taskEntry = {
        id: task.id,
        sessionId,
        passed: false,
        durationMs: 0,
        error: null,
        response: null,
        responsePath: path.join(rawDir, `${taskId}.json`),
        promptPath,
        fixtures: [],
        transcript: {
          sourcePath: transcriptSourcePath,
          auditSourcePath: auditTranscriptSourcePath,
          exists: false,
          savedCopyPath: null,
          savedAuditCopyPath: null,
        },
        artifact: {
          path: artifactSourcePath,
          format: inferArtifactFormat(task),
          exists: false,
          sizeBytes: 0,
          savedCopyPath: null,
          missingStrings: [],
          missingJsonKeys: [],
          missingCsvHeaders: [],
          missingArchiveEntries: [],
          validationErrors: [],
        },
        commandMetrics: {
          total: 0,
          succeeded: 0,
          failed: 0,
          blocked: 0,
          successPct: null,
        },
      };

      const startedAt = Date.now();
      try {
        taskEntry.fixtures = stageTaskFixtures(task, taskId, workspacePath);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(new Error('chat timeout')), options.chatTimeoutMs);
        let chatResult;
        try {
          chatResult = await fetchJson(`${gatewayBaseUrl}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${gatewayToken}`,
            },
            body: JSON.stringify({
              sessionId,
              sessionMode: 'new',
              guildId: null,
              channelId: 'tui',
              userId: 'eval-runner',
              username: 'Eval Runner',
              content: task.prompt,
              agentId: evalAgentId,
              ...(options.model ? { model: options.model } : {}),
              ...(options.chatbotId ? { chatbotId: options.chatbotId } : {}),
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        taskEntry.durationMs = Date.now() - startedAt;
        taskEntry.response = chatResult;
        writeJson(taskEntry.responsePath, chatResult);

        const toolMetrics = summarizeToolExecutions(chatResult.toolExecutions);
        taskEntry.commandMetrics = toolMetrics;
        health.tasks.commandMetrics.total += toolMetrics.total;
        health.tasks.commandMetrics.succeeded += toolMetrics.succeeded;
        health.tasks.commandMetrics.failed += toolMetrics.failed;
        health.tasks.commandMetrics.blocked += toolMetrics.blocked;

        if (fs.existsSync(artifactSourcePath)) {
          const artifactCopyPath = path.join(artifactsDir, task.artifactPath);
          fs.mkdirSync(path.dirname(artifactCopyPath), { recursive: true });
          fs.copyFileSync(artifactSourcePath, artifactCopyPath);
          Object.assign(taskEntry.artifact, validateArtifact(task, artifactSourcePath));
          taskEntry.artifact.savedCopyPath = artifactCopyPath;
        } else {
          Object.assign(taskEntry.artifact, validateArtifact(task, artifactSourcePath));
        }

        const responseText =
          typeof chatResult?.result === 'string' ? chatResult.result : '';
        const missingResponseStrings = (task.responseMustInclude || []).filter(
          (needle) => !responseText.includes(needle),
        );

        taskEntry.passed =
          chatResult?.status === 'success' &&
          !chatResult?.pendingApproval &&
          taskEntry.artifact.exists &&
          taskEntry.artifact.missingStrings.length === 0 &&
          taskEntry.artifact.missingJsonKeys.length === 0 &&
          taskEntry.artifact.missingCsvHeaders.length === 0 &&
          taskEntry.artifact.missingArchiveEntries.length === 0 &&
          taskEntry.artifact.validationErrors.length === 0 &&
          missingResponseStrings.length === 0 &&
          toolMetrics.failed === 0 &&
          toolMetrics.blocked === 0;

        if (!taskEntry.passed) {
          taskEntry.error =
            chatResult?.error ||
            (chatResult?.pendingApproval ? 'Pending approval returned by gateway.' : '') ||
            (taskEntry.artifact.exists
              ? `Artifact checks failed: ${describeArtifactProblems(taskEntry.artifact).join('; ')}`
              : 'Expected artifact was not created.');
        }
      } catch (error) {
        taskEntry.durationMs = Date.now() - startedAt;
        taskEntry.error = error instanceof Error ? error.message : String(error);
      }

      await waitForFile(transcriptSourcePath, 4_000);
      await waitForFile(auditTranscriptSourcePath, 4_000);
      await waitForFile(artifactSourcePath, 4_000);

      if (fs.existsSync(transcriptSourcePath)) {
        taskEntry.transcript.exists = true;
        const transcriptCopyPath = path.join(transcriptsDir, `${taskId}.session.jsonl`);
        fs.copyFileSync(transcriptSourcePath, transcriptCopyPath);
        taskEntry.transcript.savedCopyPath = transcriptCopyPath;
      }

      if (fs.existsSync(auditTranscriptSourcePath)) {
        const auditTranscriptCopyPath = path.join(transcriptsDir, `${taskId}.wire.jsonl`);
        fs.copyFileSync(auditTranscriptSourcePath, auditTranscriptCopyPath);
        taskEntry.transcript.savedAuditCopyPath = auditTranscriptCopyPath;
        if (!taskEntry.transcript.savedCopyPath) {
          taskEntry.transcript.savedCopyPath = auditTranscriptCopyPath;
        }
      }

      if (fs.existsSync(artifactSourcePath) && !taskEntry.artifact.savedCopyPath) {
        const artifactCopyPath = path.join(artifactsDir, task.artifactPath);
        fs.mkdirSync(path.dirname(artifactCopyPath), { recursive: true });
        fs.copyFileSync(artifactSourcePath, artifactCopyPath);
        Object.assign(taskEntry.artifact, validateArtifact(task, artifactSourcePath));
        taskEntry.artifact.savedCopyPath = artifactCopyPath;
      }

      health.tasks.items.push(taskEntry);
      if (taskEntry.passed) {
        health.tasks.passed += 1;
      }
    }

    const commandTotal = health.tasks.commandMetrics.total;
    health.tasks.passPct =
      health.tasks.total > 0
        ? Number(((health.tasks.passed / health.tasks.total) * 100).toFixed(1))
        : 0;
    health.tasks.commandMetrics.successPct =
      commandTotal > 0
        ? Number(
            (
              (health.tasks.commandMetrics.succeeded / commandTotal) *
              100
            ).toFixed(1),
          )
        : null;
  } catch (error) {
    health.error = error instanceof Error ? error.message : String(error);
  } finally {
    await stopGatewayProcess(gatewayChild);
    health.finishedAt = new Date().toISOString();
    writeJson(path.join(resultDir, 'health.json'), health);
    writeText(path.join(resultDir, 'summary.md'), buildSummary(health));
  }

  console.log(`Results: ${resultDir}`);
  console.log(
    `Tasks: ${health.tasks.passed}/${health.tasks.total} passed (${health.tasks.passPct}%)`,
  );
  console.log(
    `Successful commands: ${
      health.tasks.commandMetrics.successPct == null
        ? 'n/a'
        : `${health.tasks.commandMetrics.succeeded}/${health.tasks.commandMetrics.total} (${health.tasks.commandMetrics.successPct}%)`
    }`,
  );

  if (health.error || health.tasks.passed !== health.tasks.total) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
