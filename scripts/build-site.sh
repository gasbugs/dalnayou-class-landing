#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-${ROOT}/dist}"

rm -rf "${OUT}"
mkdir -p "${OUT}/images" "${OUT}/styles" "${OUT}/cardnews/png" "${OUT}/ads/png"

cp \
  "${ROOT}/index.html" \
  "${ROOT}/main.html" \
  "${ROOT}/roblox.html" \
  "${ROOT}/notebooklm.html" \
  "${ROOT}/poster.html" \
  "${ROOT}/refund.html" \
  "${ROOT}/privacy.html" \
  "${ROOT}/404.html" \
  "${ROOT}/campaign-pricing.js" \
  "${ROOT}/ga4-events.js" \
  "${ROOT}/marketing-events.js" \
  "${ROOT}/robots.txt" \
  "${ROOT}/sitemap.xml" \
  "${ROOT}/.nojekyll" \
  "${OUT}/"

cp \
  "${ROOT}/styles/main.css" \
  "${ROOT}/styles/roblox.css" \
  "${ROOT}/styles/notebooklm.css" \
  "${OUT}/styles/"

cp \
  "${ROOT}/images/a4-poster-apply-qr.png" \
  "${ROOT}/images/cardnews-page-qr.png" \
  "${ROOT}/images/classroom.jpg" \
  "${ROOT}/images/classroom.webp" \
  "${ROOT}/images/cloud-security-lab-logo.png" \
  "${ROOT}/images/dalnayou-b1-route.webp" \
  "${ROOT}/images/gemini-spark.webp" \
  "${ROOT}/images/house1-v2.webp" \
  "${ROOT}/images/house2-v3.webp" \
  "${ROOT}/images/notebooklm-w1.png" \
  "${ROOT}/images/notebooklm-w2-poster.jpg" \
  "${ROOT}/images/notebooklm-w2.mp4" \
  "${ROOT}/images/notebooklm-w3.png" \
  "${ROOT}/images/notebooklm-w4.png" \
  "${ROOT}/images/notebooklm.png" \
  "${ROOT}/images/notebooklm.webp" \
  "${ROOT}/images/notebooklm-docusign-workplace.webp" \
  "${ROOT}/images/notebooklm_mindmap.webp" \
  "${ROOT}/images/park-v2.webp" \
  "${ROOT}/images/publish-v2.webp" \
  "${ROOT}/images/roblox-creator-cole-tucker.webp" \
  "${ROOT}/images/roblox_screen-v2.png" \
  "${ROOT}/images/roblox_screen-v2.webp" \
  "${ROOT}/images/sosa-station-location.svg" \
  "${ROOT}/images/shorts-cover.jpg" \
  "${OUT}/images/"

cp "${ROOT}/cardnews/index.html" "${OUT}/cardnews/"
cp "${ROOT}/cardnews/"*.zip "${OUT}/cardnews/"
cp "${ROOT}/cardnews/png/"*.png "${OUT}/cardnews/png/"

cp "${ROOT}/ads/index.html" "${OUT}/ads/"
cp "${ROOT}/ads/meta-enterprise-candidates.zip" "${OUT}/ads/"
cp "${ROOT}/ads/png/"*.png "${OUT}/ads/png/"

echo "Built public site at ${OUT}"
