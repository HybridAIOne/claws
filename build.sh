#!/usr/bin/env bash
# build.sh — Builds each claw source directory in src/ into a spec-compliant
# .claw archive in dist/.
#
# Usage: ./build.sh [src-dir]
#   Defaults to ./src if no argument is given.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="${1:-$REPO_ROOT/src}"
DIST_DIR="$REPO_ROOT/dist"

mkdir -p "$DIST_DIR"

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
