#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAILWIND="${ROOT}/node_modules/.bin/tailwindcss"

if [[ ! -x "${TAILWIND}" ]]; then
  printf 'Missing Tailwind CLI. Run npm ci first.\n' >&2
  exit 1
fi

cd "${ROOT}"
mkdir -p "${ROOT}/styles"

"${TAILWIND}" \
  --config "${ROOT}/tailwind.main.config.cjs" \
  --input "${ROOT}/styles/tailwind.input.css" \
  --output "${ROOT}/styles/main.css" \
  --minify

"${TAILWIND}" \
  --config "${ROOT}/tailwind.roblox.config.cjs" \
  --input "${ROOT}/styles/tailwind.input.css" \
  --output "${ROOT}/styles/roblox.css" \
  --minify

"${TAILWIND}" \
  --config "${ROOT}/tailwind.notebooklm.config.cjs" \
  --input "${ROOT}/styles/tailwind.input.css" \
  --output "${ROOT}/styles/notebooklm.css" \
  --minify

printf 'Built static Tailwind CSS for main, Roblox, and NotebookLM pages.\n'
