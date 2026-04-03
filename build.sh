#!/usr/bin/env bash
# build.sh — Builds each claw source directory in src/ into a spec-compliant
# .claw archive in dist/.
#
# Usage: ./build.sh [options] [src-dir]
#   Defaults to ./src if no argument is given.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$REPO_ROOT/dist"

SRC_DIR="$REPO_ROOT/src"
RUN_BUNDLE_IMPORTS=0
declare -a BUNDLE_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle-imports)
      RUN_BUNDLE_IMPORTS=1
      shift
      ;;
    --bundle-force)
      RUN_BUNDLE_IMPORTS=1
      BUNDLE_ARGS+=("--force")
      shift
      ;;
    --bundle-persona)
      RUN_BUNDLE_IMPORTS=1
      [[ $# -ge 2 ]] || {
        echo "--bundle-persona requires a value" >&2
        exit 1
      }
      BUNDLE_ARGS+=("--persona" "$2")
      shift 2
      ;;
    --bundle-include-slug)
      RUN_BUNDLE_IMPORTS=1
      [[ $# -ge 2 ]] || {
        echo "--bundle-include-slug requires a value" >&2
        exit 1
      }
      BUNDLE_ARGS+=("--include-slug" "$2")
      shift 2
      ;;
    --bundle-base-url)
      RUN_BUNDLE_IMPORTS=1
      [[ $# -ge 2 ]] || {
        echo "--bundle-base-url requires a value" >&2
        exit 1
      }
      BUNDLE_ARGS+=("--base-url" "$2")
      shift 2
      ;;
    --help|-h)
      cat <<'EOF'
Usage: ./build.sh [options] [src-dir]

Build options:
  [src-dir]                    Source directory (default: ./src)

Bundling options (optional pre-step):
  --bundle-imports             Bundle clawhub imports before packing
  --bundle-force               Overwrite existing workspace/skills/<slug>
  --bundle-persona <id>        Bundle only selected persona (repeatable)
  --bundle-include-slug <slug> Bundle only selected clawhub slug (repeatable)
  --bundle-base-url <url>      Override ClawHub API base URL for bundling
EOF
      exit 0
      ;;
    *)
      if [[ "$1" == -* ]]; then
        echo "Unknown option: $1" >&2
        exit 1
      fi
      SRC_DIR="$1"
      shift
      ;;
  esac
done

mkdir -p "$DIST_DIR"

if [[ "$RUN_BUNDLE_IMPORTS" -eq 1 ]]; then
  echo "Bundling clawhub imports into workspace/skills..."
  node "$REPO_ROOT/scripts/bundle_clawhub_imports.mjs" "${BUNDLE_ARGS[@]}"
fi

read_manifest_array() {
  local manifest_path="$1"
  local selector="$2"

  node --input-type=module - "$manifest_path" "$selector" <<'EOF'
import fs from 'node:fs';

const manifestPath = process.argv[2];
const selector = process.argv[3];
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

let value = manifest;
for (const segment of selector.split('.')) {
  value = value?.[segment];
}

if (Array.isArray(value)) {
  for (const entry of value) {
    if (typeof entry === 'string' && entry.trim()) {
      console.log(entry.trim());
    }
  }
}
EOF
}

stage_claw_dir() {
  local source_dir="$1"
  local stage_dir="$2"
  local manifest_path="$stage_dir/manifest.json"
  local workspace_skills_dir="$stage_dir/workspace/skills"
  local archive_skills_dir="$stage_dir/skills"
  local archive_plugins_dir="$stage_dir/plugins"
  local bundled_skill=""
  local bundled_plugin=""

  mkdir -p "$stage_dir"
  cp -R "$source_dir"/. "$stage_dir"/

  if [[ ! -f "$manifest_path" ]]; then
    echo "Missing manifest.json in $source_dir" >&2
    return 1
  fi

  while IFS= read -r bundled_skill; do
    [[ -n "$bundled_skill" ]] || continue
    if [[ ! -d "$workspace_skills_dir/$bundled_skill" ]]; then
      echo "Bundled skill \"$bundled_skill\" is listed in $manifest_path but missing from workspace/skills/" >&2
      return 1
    fi
    mkdir -p "$archive_skills_dir"
    mv "$workspace_skills_dir/$bundled_skill" "$archive_skills_dir/$bundled_skill"
  done < <(read_manifest_array "$manifest_path" "skills.bundled")

  if [[ -d "$workspace_skills_dir" ]] && [[ -z "$(find "$workspace_skills_dir" -mindepth 1 -print -quit)" ]]; then
    rmdir "$workspace_skills_dir"
  fi

  while IFS= read -r bundled_plugin; do
    [[ -n "$bundled_plugin" ]] || continue
    if [[ ! -d "$archive_plugins_dir/$bundled_plugin" ]]; then
      echo "Bundled plugin \"$bundled_plugin\" is listed in $manifest_path but missing from plugins/" >&2
      return 1
    fi
  done < <(read_manifest_array "$manifest_path" "plugins.bundled")
}

found=0
for dir in "$SRC_DIR"/*/; do
  [[ -d "$dir" ]] || continue

  name="$(basename "$dir")"
  outfile="$DIST_DIR/${name}.claw"
  temp_dir="$(mktemp -d "${TMPDIR:-/tmp}/claw-build.XXXXXX")"
  stage_dir="$temp_dir/$name"

  echo "Packing $name -> $outfile"
  stage_claw_dir "$dir" "$stage_dir"
  rm -f "$outfile"
  (
    cd "$stage_dir"
    zip -qr "$outfile" .
  )
  rm -rf "$temp_dir"
  found=$((found + 1))
done

if [[ "$found" -eq 0 ]]; then
  echo "No directories found in $SRC_DIR" >&2
  exit 1
fi

echo "Built $found .claw file(s) in $DIST_DIR"
