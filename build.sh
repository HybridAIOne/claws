#!/usr/bin/env bash
# build.sh — Zips each claw source directory in src/ into a .claw file in dist/
#
# Usage: ./build.sh [src-dir]
#   Defaults to ./src if no argument is given.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="${1:-$REPO_ROOT/src}"
DIST_DIR="$REPO_ROOT/dist"

mkdir -p "$DIST_DIR"

found=0
for dir in "$SRC_DIR"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  outfile="$DIST_DIR/${name}.claw"
  echo "Packing $name -> $outfile"
  (cd "$dir" && zip -r "$outfile" .)
  found=$((found + 1))
done

if [ "$found" -eq 0 ]; then
  echo "No directories found in $SRC_DIR" >&2
  exit 1
fi

echo "Built $found .claw file(s) in $DIST_DIR"
