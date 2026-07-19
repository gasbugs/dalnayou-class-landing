#!/usr/bin/env bash
set -uo pipefail

ROOT="${1:-.}"
ROOT="$(cd "$ROOT" && pwd)"
failures=0
warnings=0

pass() { printf 'PASS  %s\n' "$1"; }
warn() { printf 'WARN  %s\n' "$1"; warnings=$((warnings + 1)); }
fail() { printf 'FAIL  %s\n' "$1"; failures=$((failures + 1)); }

require_file() {
  local file="$1"
  if [[ -f "$ROOT/$file" ]]; then pass "$file exists"; else fail "$file is missing"; fi
}

contains() {
  local file="$1" pattern="$2" label="$3"
  if rg -q -- "$pattern" "$ROOT/$file"; then pass "$label"; else fail "$label"; fi
}

not_contains() {
  local file="$1" pattern="$2" label="$3"
  if rg -q -- "$pattern" "$ROOT/$file"; then fail "$label"; else pass "$label"; fi
}

printf 'Dalnayou landing audit: %s\n\n' "$ROOT"

required_files=(
  index.html main.html index-legacy.html roblox.html notebooklm.html
  poster.html refund.html cardnews/index.html cardnews/source.html
  tracking-links.md .github/workflows/pages.yml scripts/render-cardnews.sh
)
for file in "${required_files[@]}"; do require_file "$file"; done

printf '\nTracking structure\n'
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html cardnews/index.html; do
  contains "$file" 'GTM-KVC6H3SL' "$file includes the GTM container"
done
contains roblox.html 'data-track-event="apply_click"' 'Roblox application CTAs are tracked'
contains notebooklm.html 'data-track-event="apply_click"' 'NotebookLM application CTAs are tracked'
contains index.html 'landing_source_detected' 'Main landing detects source parameters'
contains roblox.html 'dalnayou_landing_source' 'Roblox page preserves landing source context'
contains notebooklm.html 'dalnayou_landing_source' 'NotebookLM page preserves landing source context'

printf '\nA4 poster invariants\n'
not_contains poster.html '189,000|249,000|24% OFF|6만원' 'A4 poster does not disclose price'
contains poster.html 'utm_source%3Da4_poster' 'A4 QR identifies its print source'
contains poster.html 'utm_medium%3Doffline' 'A4 QR uses the offline medium'
contains poster.html 'utm_content%3Dprint_qr' 'A4 QR identifies the print QR placement'
contains poster.html 'class="print-cta no-print"' 'A4 page retains a screen-only print button'

printf '\nOperator copy invariants\n'
payment_count="$(rg -c '<h3>.*입금 요청</h3>' "$ROOT/cardnews/index.html" || true)"
confirmation_count="$(rg -c '<h3>.*과정 확정</h3>' "$ROOT/cardnews/index.html" || true)"
if [[ "$payment_count" == "2" ]]; then pass 'Two course-specific payment templates exist'; else fail "Expected 2 payment templates, found $payment_count"; fi
if [[ "$confirmation_count" == "2" ]]; then pass 'Two course-specific confirmation templates exist'; else fail "Expected 2 confirmation templates, found $confirmation_count"; fi
contains cardnews/index.html 'cloudsecuritylab\.notion\.site/67ab4138eb88824c837601ca00e990af' 'Roblox signup guide uses the current Cloud Security Lab URL'
not_contains cardnews/index.html 'mupersei\.notion\.site' 'Old Roblox signup guide URL is absent'

printf '\nMirrored page consistency\n'
if diff -q \
  <(sed 's#https://gasbugs.github.io/dalnayou-class-landing/main.html#https://gasbugs.github.io/dalnayou-class-landing/#' "$ROOT/main.html") \
  "$ROOT/index.html" >/dev/null; then
  pass 'index.html and main.html differ only by their intentional OG URL'
else
  warn 'index.html and main.html have behavioral differences; inspect their diff'
fi

printf '\nDerived card-news assets\n'
instagram_count="$(find "$ROOT/cardnews/png" -maxdepth 1 -name 'instagram-*.png' | wc -l | tr -d ' ')"
daangn_count="$(find "$ROOT/cardnews/png" -maxdepth 1 -name 'daangn-*.png' | wc -l | tr -d ' ')"
if [[ "$instagram_count" == "8" ]]; then pass 'Eight Instagram cards exist'; else fail "Expected 8 Instagram cards, found $instagram_count"; fi
if [[ "$daangn_count" == "8" ]]; then pass 'Eight Daangn cards exist'; else fail "Expected 8 Daangn cards, found $daangn_count"; fi
require_file cardnews/instagram-cardnews-png.zip
require_file cardnews/daangn-cardnews-png.zip

printf '\nGit hygiene\n'
if git -C "$ROOT" diff --check >/dev/null; then pass 'Working-tree diff has no whitespace errors'; else fail 'Working-tree diff contains whitespace errors'; fi

printf '\nSummary: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
if (( failures > 0 )); then exit 1; fi
