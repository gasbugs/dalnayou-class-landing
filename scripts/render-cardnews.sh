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

  "${CHROME}" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --screenshot="${ROOT}/${output}" \
    --window-size="${width},${height}" \
    "${SOURCE}?card=${id}"
}

render_card "instagram-01-cover" 1080 1350 "cardnews/png/instagram-01-cover.png"
render_card "instagram-02-problem" 1080 1350 "cardnews/png/instagram-02-problem.png"
render_card "instagram-03-courses" 1080 1350 "cardnews/png/instagram-03-courses.png"
render_card "instagram-04-notebooklm" 1080 1350 "cardnews/png/instagram-04-notebooklm.png"
render_card "instagram-05-roblox" 1080 1350 "cardnews/png/instagram-05-roblox.png"
render_card "instagram-06-difference" 1080 1350 "cardnews/png/instagram-06-difference.png"
render_card "instagram-07-info" 1080 1350 "cardnews/png/instagram-07-info.png"
render_card "instagram-08-cta" 1080 1350 "cardnews/png/instagram-08-cta.png"

render_card "daangn-01-local" 1080 1080 "cardnews/png/daangn-01-local.png"
render_card "daangn-02-courses" 1080 1080 "cardnews/png/daangn-02-courses.png"
render_card "daangn-03-cta" 1080 1080 "cardnews/png/daangn-03-cta.png"

(cd "${ROOT}/cardnews/png" && zip -q -j ../instagram-cardnews-png.zip instagram-*.png)
(cd "${ROOT}/cardnews/png" && zip -q -j ../daangn-cardnews-png.zip daangn-*.png)
