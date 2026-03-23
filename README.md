# Claws

Pre-built `.claw` agent packages for HybridClaw.

## dist/

Contains ready-to-use `.claw` files (zip archives of agent workspaces).

## Building

To rebuild `.claw` files from source directories:

```bash
./build.sh <path-to-artifacts-dir>
```

This zips each subdirectory in the given artifacts directory and writes
`<dirname>.claw` files to `dist/`.
