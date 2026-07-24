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
  tracking-links.md campaign-pricing.js robots.txt sitemap.xml 404.html
  marketing-events.js images/roblox-creator-cole-tucker.webp
  images/notebooklm-docusign-workplace.webp
  .github/workflows/pages.yml scripts/render-cardnews.sh scripts/build-site.sh
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
contains campaign-pricing.js 'entry\.1074868867' 'Application links prefill the Google Form attribution field'
contains campaign-pricing.js 'entry\.240966579' 'Application links preselect the Google Form course'
contains campaign-pricing.js 'AI로 만드는 내 학습 비서' 'NotebookLM form option is mapped'
contains campaign-pricing.js 'AI로 만드는 내 게임' 'Roblox form option is mapped'
contains campaign-pricing.js 'earlybird_1' 'First early-bird phase exists'
contains campaign-pricing.js 'earlybird_2' 'Second early-bird phase exists'
contains campaign-pricing.js 'label: "파이널 등록"' 'Final registration phase exists'
contains campaign-pricing.js 'price: 189000' 'First phase price is 189,000 won'
contains campaign-pricing.js 'price: 199000' 'Second phase price is 199,000 won'
contains campaign-pricing.js 'price: 209000' 'Final phase price is 209,000 won'
contains marketing-events.js '2173864043186723' 'Meta Pixel uses the Cloud Security Lab data set'
contains marketing-events.js '"ApplyClick"' 'Meta Pixel distinguishes application clicks from completions'
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html cardnews/index.html 404.html; do
  contains "$file" 'marketing-events\.js' "$file includes the Meta Pixel loader"
done

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
  <(sed \
    -e 's#https://gasbugs.github.io/dalnayou-class-landing/main.html#https://gasbugs.github.io/dalnayou-class-landing/#' \
    -e '/<meta name="robots" content="noindex,follow" \/>/d' \
    "$ROOT/main.html") \
  "$ROOT/index.html" >/dev/null; then
  pass 'index.html and main.html differ only by intentional metadata'
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

printf '\nMobile asset budget\n'
notebooklm_video_bytes="$(wc -c < "$ROOT/images/notebooklm-w2.mp4" | tr -d ' ')"
if (( notebooklm_video_bytes <= 3145728 )); then
  pass 'NotebookLM result video stays within the 3 MiB mobile budget'
else
  warn "NotebookLM result video exceeds the 3 MiB mobile budget (${notebooklm_video_bytes} bytes)"
fi

printf '\nPublic deployment artifact\n'
contains .github/workflows/pages.yml 'bash scripts/build-site\.sh' 'Pages workflow builds the public allowlist'
contains .github/workflows/pages.yml "path: 'dist'" 'Pages workflow deploys dist'
if [[ -d "$ROOT/dist" ]]; then
  if find "$ROOT/dist" -type f \( -name '*preview*' -o -name 'index-legacy.html' -o -name 'source.html' \) | grep -q .; then
    fail 'Public artifact contains a preview, legacy, or source page'
  else
    pass 'Public artifact excludes preview, legacy, and source pages'
  fi
else
  warn 'dist is absent; run bash scripts/build-site.sh before publishing'
fi

printf '\nGit hygiene\n'
if git -C "$ROOT" diff --check >/dev/null; then pass 'Working-tree diff has no whitespace errors'; else fail 'Working-tree diff contains whitespace errors'; fi

printf '\nSummary: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
if (( failures > 0 )); then exit 1; fi
