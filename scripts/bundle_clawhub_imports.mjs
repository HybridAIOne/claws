#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DEFAULT_CLAWHUB_BASE_URL = 'https://clawhub.ai/api/v1';
const RETRYABLE_STATUS_CODES = new Set([429, 503]);
const RETRY_MAX_RETRIES = 3;
const RETRY_INITIAL_DELAY_MS = 1000;

function usage() {
  console.log(`Usage: node scripts/bundle_clawhub_imports.mjs [options]

Options:
  --dry-run                Show planned changes without writing files
  --force                  Overwrite existing workspace/skills/<slug> directories
  --persona <id>           Limit to one persona id (repeatable)
  --include-slug <slug>    Limit to one clawhub slug (repeatable)
  --base-url <url>         Override clawhub API base URL
  --help                   Show this help

Examples:
  node scripts/bundle_clawhub_imports.mjs --dry-run
  node scripts/bundle_clawhub_imports.mjs --persona anika --persona nora
  node scripts/bundle_clawhub_imports.mjs --include-slug gog --include-slug self-integration
`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    personas: new Set(),
    includeSlugs: new Set(),
    baseUrl:
      process.env.CLAWHUB_API_BASE_URL?.replace(/\/+$/, '') ||
      DEFAULT_CLAWHUB_BASE_URL,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--persona') {
      const value = argv[i + 1];
      if (!value) throw new Error('--persona requires a value');
      options.personas.add(value.trim());
      i += 1;
      continue;
    }
    if (arg === '--include-slug') {
      const value = argv[i + 1];
      if (!value) throw new Error('--include-slug requires a value');
      options.includeSlugs.add(value.trim());
      i += 1;
      continue;
    }
    if (arg === '--base-url') {
      const value = argv[i + 1];
      if (!value) throw new Error('--base-url requires a value');
      options.baseUrl = value.replace(/\/+$/, '');
      i += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function findPersonaDirs(repoRoot) {
  const srcDir = path.join(repoRoot, 'src');
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      id: entry.name,
      dir: path.join(srcDir, entry.name),
      manifestPath: path.join(srcDir, entry.name, 'manifest.json'),
    }))
    .filter((entry) => fs.existsSync(entry.manifestPath));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function extractClawhubSlug(source) {
  if (typeof source !== 'string') return null;
  const match = source.match(/^clawhub\/([a-z0-9._-]+)$/i);
  return match ? match[1] : null;
}

function hasSkillManifest(dirPath) {
  return (
    fs.existsSync(path.join(dirPath, 'SKILL.md')) ||
    fs.existsSync(path.join(dirPath, 'skill.md'))
  );
}

function resolveExtractedSkillRoot(extractDir) {
  if (hasSkillManifest(extractDir)) return extractDir;

  const queue = [extractDir];
  const roots = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(current, entry.name);
      if (hasSkillManifest(fullPath)) {
        roots.push(fullPath);
      } else {
        queue.push(fullPath);
      }
    }
  }

  if (roots.length === 1) {
    return roots[0];
  }

  throw new Error(
    `Expected exactly one extracted skill root with SKILL.md, found ${roots.length}`,
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(header) {
  if (!header) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }
  const date = Date.parse(header);
  if (!Number.isNaN(date)) {
    return Math.max(date - Date.now(), 0);
  }
  return null;
}

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url);
      if (
        RETRYABLE_STATUS_CODES.has(response.status) &&
        attempt < RETRY_MAX_RETRIES
      ) {
        const retryAfterMs = parseRetryAfterMs(
          response.headers.get('Retry-After'),
        );
        const backoffMs = retryAfterMs ?? RETRY_INITIAL_DELAY_MS * 2 ** attempt;
        console.warn(
          `[retry ${attempt + 1}/${RETRY_MAX_RETRIES}] HTTP ${response.status} for ${url}, waiting ${backoffMs}ms`,
        );
        await response.body?.cancel().catch(() => undefined);
        await sleep(backoffMs);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_MAX_RETRIES) {
        const backoffMs = RETRY_INITIAL_DELAY_MS * 2 ** attempt;
        console.warn(
          `[retry ${attempt + 1}/${RETRY_MAX_RETRIES}] network error for ${url}, waiting ${backoffMs}ms`,
        );
        await sleep(backoffMs);
      }
    }
  }
  throw lastError;
}

async function fetchJson(url) {
  const response = await fetchWithRetry(url);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Request failed for ${url}: HTTP ${response.status}${detail ? ` ${detail.trim()}` : ''}`,
    );
  }
  return await response.json();
}

async function fetchBytes(url) {
  const response = await fetchWithRetry(url);
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Request failed for ${url}: HTTP ${response.status}${detail ? ` ${detail.trim()}` : ''}`,
    );
  }
  return new Uint8Array(await response.arrayBuffer());
}

function getLatestVersion(payload) {
  if (
    payload &&
    typeof payload === 'object' &&
    payload.latestVersion &&
    typeof payload.latestVersion === 'object' &&
    typeof payload.latestVersion.version === 'string' &&
    payload.latestVersion.version.trim()
  ) {
    return payload.latestVersion.version.trim();
  }
  if (
    payload &&
    typeof payload === 'object' &&
    payload.skill &&
    typeof payload.skill === 'object'
  ) {
    return getLatestVersion(payload.skill);
  }
  throw new Error('Skill metadata does not include latestVersion.version');
}

async function bundleSlug({
  personaId,
  slug,
  personaDir,
  baseUrl,
  dryRun,
  force,
}) {
  const workspaceSkillsDir = path.join(personaDir, 'workspace', 'skills');
  const targetDir = path.join(workspaceSkillsDir, slug);

  if (fs.existsSync(targetDir) && !force) {
    throw new Error(
      `Persona ${personaId}: workspace/skills/${slug} already exists (use --force to overwrite)`,
    );
  }

  const metadataUrl = `${baseUrl}/skills/${encodeURIComponent(slug)}`;
  const metadata = await fetchJson(metadataUrl);
  const version = getLatestVersion(metadata);

  if (dryRun) {
    return { version, targetDir, downloaded: false };
  }

  const downloadUrl = `${baseUrl}/download?slug=${encodeURIComponent(slug)}&version=${encodeURIComponent(version)}`;
  const archiveBytes = await fetchBytes(downloadUrl);

  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), `clawhub-bundle-${personaId}-${slug}-`),
  );
  const archivePath = path.join(tempRoot, `${slug}.zip`);
  const extractDir = path.join(tempRoot, 'extract');
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    fs.writeFileSync(archivePath, Buffer.from(archiveBytes));
    execFileSync('unzip', ['-qq', archivePath, '-d', extractDir]);

    const extractedRoot = resolveExtractedSkillRoot(extractDir);
    fs.mkdirSync(workspaceSkillsDir, { recursive: true });
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.cpSync(extractedRoot, targetDir, { recursive: true });
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  return { version, targetDir, downloaded: true };
}

function updateManifest(manifest, bundledSlugs) {
  const next = structuredClone(manifest);
  const skills =
    next.skills && typeof next.skills === 'object' ? next.skills : {};

  const existingBundled = Array.isArray(skills.bundled)
    ? skills.bundled.filter((value) => typeof value === 'string')
    : [];
  const bundledSet = new Set(existingBundled);
  for (const slug of bundledSlugs) {
    bundledSet.add(slug);
  }

  skills.bundled = Array.from(bundledSet).sort((a, b) => a.localeCompare(b));

  if (Array.isArray(skills.imports)) {
    const remainingImports = skills.imports.filter((entry) => {
      const source =
        entry && typeof entry === 'object' && 'source' in entry
          ? entry.source
          : null;
      const slug = extractClawhubSlug(source);
      return slug === null || !bundledSlugs.has(slug);
    });
    if (remainingImports.length > 0) {
      skills.imports = remainingImports;
    } else {
      delete skills.imports;
    }
  }

  next.skills = skills;
  return next;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }

  const repoRoot = process.cwd();
  const personas = findPersonaDirs(repoRoot).filter(
    ({ id }) => options.personas.size === 0 || options.personas.has(id),
  );

  if (personas.length === 0) {
    throw new Error('No personas matched the selection');
  }

  let totalBundled = 0;
  let totalUpdatedManifests = 0;

  for (const persona of personas) {
    const manifest = readJson(persona.manifestPath);
    const imports = Array.isArray(manifest.skills?.imports)
      ? manifest.skills.imports
      : [];

    const clawhubSlugs = imports
      .map((entry) => extractClawhubSlug(entry?.source))
      .filter((value) => value !== null);
    const selectedSlugs = clawhubSlugs.filter(
      (slug) =>
        options.includeSlugs.size === 0 || options.includeSlugs.has(slug),
    );

    if (selectedSlugs.length === 0) {
      continue;
    }

    console.log(`\nPersona: ${persona.id}`);
    const bundledThisPersona = new Set();

    for (const slug of selectedSlugs) {
      const result = await bundleSlug({
        personaId: persona.id,
        slug,
        personaDir: persona.dir,
        baseUrl: options.baseUrl,
        dryRun: options.dryRun,
        force: options.force,
      });
      bundledThisPersona.add(slug);
      totalBundled += 1;
      const mode = options.dryRun ? 'would bundle' : 'bundled';
      console.log(`  - ${mode} clawhub/${slug} @ ${result.version}`);
    }

    if (bundledThisPersona.size > 0) {
      const nextManifest = updateManifest(manifest, bundledThisPersona);
      if (!options.dryRun) {
        writeJson(persona.manifestPath, nextManifest);
      }
      totalUpdatedManifests += 1;
      const mode = options.dryRun ? 'would update' : 'updated';
      console.log(`  - ${mode} manifest.json`);
    }
  }

  if (totalBundled === 0) {
    console.log('No matching clawhub imports found.');
    return;
  }

  console.log('\nSummary:');
  console.log(`  Personas affected: ${totalUpdatedManifests}`);
  console.log(`  ClawHub imports bundled: ${totalBundled}`);
  console.log(`  Mode: ${options.dryRun ? 'dry-run' : 'write'}`);
}

main().catch((error) => {
  console.error(
    `\nError: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
