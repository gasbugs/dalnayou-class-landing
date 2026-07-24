#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
SOURCE="file://${ROOT}/cardnews/source.html"

render_card() {
  local id="$1"
  local width="$2"
  local height="$3"
  local output="$4"
  local output_path="${ROOT}/${output}"
  local profile_dir
  local chrome_pid

  profile_dir="$(mktemp -d "${TMPDIR:-/tmp}/dalnayou-cardnews.XXXXXX")"
  rm -f "${output_path}"

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
    --screenshot="${output_path}" \
    --window-size="${width},${height}" \
    "${SOURCE}?card=${id}" \
    >/dev/null 2>&1 &
  chrome_pid=$!

  for _ in {1..300}; do
    if [[ -s "${output_path}" ]]; then
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

  if [[ ! -s "${output_path}" ]]; then
    printf 'Failed to render %s\n' "${id}" >&2
    return 1
  fi
  printf 'Rendered %s\n' "${output}"
}

render_card "instagram-01-cover" 1080 1350 "cardnews/png/instagram-01-cover.png"
render_card "instagram-02-problem" 1080 1350 "cardnews/png/instagram-02-problem.png"
render_card "instagram-03-courses" 1080 1350 "cardnews/png/instagram-03-courses.png"
render_card "instagram-04-notebooklm" 1080 1350 "cardnews/png/instagram-04-notebooklm.png"
render_card "instagram-05-roblox" 1080 1350 "cardnews/png/instagram-05-roblox.png"
render_card "instagram-06-difference" 1080 1350 "cardnews/png/instagram-06-difference.png"
render_card "instagram-07-info" 1080 1350 "cardnews/png/instagram-07-info.png"
render_card "instagram-08-cta" 1080 1350 "cardnews/png/instagram-08-cta.png"

render_card "daangn-01-cover" 1080 1080 "cardnews/png/daangn-01-cover.png"
render_card "daangn-02-problem" 1080 1080 "cardnews/png/daangn-02-problem.png"
render_card "daangn-03-courses" 1080 1080 "cardnews/png/daangn-03-courses.png"
render_card "daangn-04-notebooklm" 1080 1080 "cardnews/png/daangn-04-notebooklm.png"
render_card "daangn-05-roblox" 1080 1080 "cardnews/png/daangn-05-roblox.png"
render_card "daangn-06-difference" 1080 1080 "cardnews/png/daangn-06-difference.png"
render_card "daangn-07-info" 1080 1080 "cardnews/png/daangn-07-info.png"
render_card "daangn-08-cta" 1080 1080 "cardnews/png/daangn-08-cta.png"

rm -f "${ROOT}/cardnews/instagram-cardnews-png.zip" "${ROOT}/cardnews/daangn-cardnews-png.zip"

(cd "${ROOT}/cardnews/png" && zip -q -j ../instagram-cardnews-png.zip instagram-*.png)
(cd "${ROOT}/cardnews/png" && zip -q -j ../daangn-cardnews-png.zip \
  daangn-01-cover.png \
  daangn-02-problem.png \
  daangn-03-courses.png \
  daangn-04-notebooklm.png \
  daangn-05-roblox.png \
  daangn-06-difference.png \
  daangn-07-info.png \
  daangn-08-cta.png)
