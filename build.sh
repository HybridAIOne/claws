#!/usr/bin/env bash
# build.sh — Zips each claw directory in artifacts/ into a .claw file in dist/
#
# Usage: ./build.sh <artifacts-dir>
#   e.g.: ./build.sh ../hybridclaw/artifacts

set -euo pipefail

ARTIFACTS_DIR="${1:?Usage: $0 <artifacts-dir>}"
DIST_DIR="$(cd "$(dirname "$0")" && pwd)/dist"

mkdir -p "$DIST_DIR"

found=0
for dir in "$ARTIFACTS_DIR"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  outfile="$DIST_DIR/${name}.claw"
  echo "Packing $name -> $outfile"
  (cd "$dir" && zip -r "$outfile" .)
  found=$((found + 1))
done

if [ "$found" -eq 0 ]; then
  echo "No directories found in $ARTIFACTS_DIR" >&2
  exit 1
fi

echo "Built $found .claw file(s) in $DIST_DIR"
