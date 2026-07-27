#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
SOURCE="file://${ROOT}/experiments/e-011-notebook-workload-ad-preview.html"
OUT="${ROOT}/experiments/assets"

mkdir -p "${OUT}"

render_creative() {
  local format="$1"
  local width="$2"
  local height="$3"
  local output="${OUT}/e-011-notebook-workload-${format}.png"
  local profile_dir
  local chrome_pid

  profile_dir="$(mktemp -d "${TMPDIR:-/tmp}/dalnayou-e011.XXXXXX")"
  rm -f "${output}"

  "${CHROME}" \
    --headless \
    --disable-gpu \
    --disable-background-networking \
    --disable-component-update \
    --disable-default-apps \
    --disable-sync \
    --metrics-recording-only \
    --no-default-browser-check \
    --no-first-run \
    --user-data-dir="${profile_dir}" \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --screenshot="${output}" \
    --window-size="${width},${height}" \
    "${SOURCE}?format=${format}" \
    >/dev/null 2>&1 &
  chrome_pid=$!

  for _ in {1..300}; do
    if [[ -s "${output}" ]]; then
      break
    fi
    if ! kill -0 "${chrome_pid}" 2>/dev/null; then
      break
    fi
    sleep 0.1
  done

  kill "${chrome_pid}" 2>/dev/null || true
  wait "${chrome_pid}" 2>/dev/null || true
  rm -rf "${profile_dir}"

  if [[ ! -s "${output}" ]]; then
    printf 'Failed to render %s\n' "${format}" >&2
    return 1
  fi
  printf 'Rendered %s\n' "${output#${ROOT}/}"
}

render_creative "feed" 1080 1350
render_creative "story" 1080 1920
