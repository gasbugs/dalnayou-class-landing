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

require_png_dimensions() {
  local file="$1" dimensions="$2"
  local description
  description="$(file "$ROOT/$file" 2>/dev/null || true)"
  if [[ "$description" == *"$dimensions"* ]]; then
    pass "$file is $dimensions"
  else
    fail "$file is not $dimensions"
  fi
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
  poster.html refund.html privacy.html cardnews/index.html cardnews/source.html
  ads/index.html ads/source.html ads/meta-enterprise-candidates.zip scripts/render-meta-ads.sh
  tracking-links.md meta-ad-plan.md marketing-history.md campaign-pricing.js robots.txt sitemap.xml 404.html
  marketing/snapshots.jsonl marketing-report.md scripts/analyze-marketing-funnel.mjs
  ga4-events.js marketing-events.js images/roblox-creator-cole-tucker.webp
  images/gemini-spark.webp
  images/shorts-cover.jpg
  images/notebooklm-docusign-workplace.webp
  package.json package-lock.json styles/main.css styles/roblox.css styles/notebooklm.css
  .github/workflows/pages.yml scripts/render-cardnews.sh scripts/render-meta-ads.sh
  scripts/build-tailwind-css.sh scripts/build-site.sh
)
for file in "${required_files[@]}"; do require_file "$file"; done

printf '\nTracking structure\n'
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html privacy.html cardnews/index.html; do
  contains "$file" 'GTM-KVC6H3SL' "$file includes the GTM container"
done
contains ads/index.html 'GTM-KVC6H3SL' 'Meta candidate page includes the GTM container'
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html privacy.html cardnews/index.html ads/index.html 404.html; do
  contains "$file" 'ga4-events\.js' "$file includes the direct GA4 loader"
done
contains ga4-events.js 'G-6W058PFM90' 'Shared GA4 loader uses the production measurement ID'
contains ga4-events.js 'dalnayouSendGa4' 'Shared GA4 loader exposes the custom event sender'
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html privacy.html cardnews/index.html ads/index.html; do
  contains "$file" 'dalnayouSendGa4' "$file sends custom events directly to GA4"
done
contains ads/index.html 'marketing-events\.js' 'Meta candidate page includes the Meta Pixel loader'
contains ads/index.html 'roblox_enterprise_v1' 'Roblox candidate has a unique tracked URL'
contains ads/index.html 'notebooklm_enterprise_v1' 'Notebook candidate has a unique tracked URL'
for file in \
  ads/png/meta-roblox-enterprise-feed.png \
  ads/png/meta-roblox-enterprise-story.png \
  ads/png/meta-notebooklm-enterprise-feed.png \
  ads/png/meta-notebooklm-enterprise-story.png; do
  require_file "$file"
done
require_png_dimensions ads/png/meta-roblox-enterprise-feed.png '1080 x 1350'
require_png_dimensions ads/png/meta-roblox-enterprise-story.png '1080 x 1920'
require_png_dimensions ads/png/meta-notebooklm-enterprise-feed.png '1080 x 1350'
require_png_dimensions ads/png/meta-notebooklm-enterprise-story.png '1080 x 1920'
contains roblox.html 'data-track-event="apply_click"' 'Roblox application CTAs are tracked'
contains notebooklm.html 'data-track-event="apply_click"' 'NotebookLM application CTAs are tracked'
contains roblox.html 'data-track-label="roblox_enterprise_trust_form"' 'Roblox trust proof has a distinct application CTA'
contains notebooklm.html 'data-track-label="notebooklm_enterprise_trust_form"' 'NotebookLM trust proof has a distinct application CTA'
for file in index.html main.html roblox.html notebooklm.html; do
  not_contains "$file" 'cdn\.tailwindcss\.com' "$file does not depend on Tailwind Play CDN"
done
contains index.html 'styles/main\.css' 'Main landing loads compiled Tailwind CSS'
contains main.html 'styles/main\.css' 'Main mirror loads compiled Tailwind CSS'
contains roblox.html 'styles/roblox\.css' 'Roblox page loads compiled Tailwind CSS'
contains notebooklm.html 'styles/notebooklm\.css' 'Notebook page loads compiled Tailwind CSS'
contains index.html 'loading="eager" fetchpriority="high".*notebooklm|notebooklm[^>]*loading="eager" fetchpriority="high"' 'Main landing prioritizes the Notebook hero image'
contains main.html 'loading="eager" fetchpriority="high".*notebooklm|notebooklm[^>]*loading="eager" fetchpriority="high"' 'Main mirror prioritizes the Notebook hero image'
contains marketing-history.md 'payment_confirmed' 'Marketing history tracks confirmed payments as the final conversion'
contains marketing-history.md '자료 부족' 'Marketing history distinguishes insufficient data from failure'
contains marketing-report.md '클씨랩 AI 클래스 퍼널 보고서' 'Generated marketing funnel report exists'
contains marketing-report.md '자료 부족' 'Generated report enforces sample-readiness language'
if node "$ROOT/scripts/analyze-marketing-funnel.mjs" >/dev/null; then
  pass 'Marketing snapshot data passes deterministic analysis'
else
  fail 'Marketing snapshot data or analyzer is invalid'
fi
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
for file in index.html main.html roblox.html notebooklm.html poster.html refund.html privacy.html cardnews/index.html 404.html; do
  contains "$file" 'marketing-events\.js' "$file includes the Meta Pixel loader"
done
contains privacy.html '수집·이용 목적' 'Privacy notice states the collection purpose'
contains privacy.html '수집 항목' 'Privacy notice states the collected fields'
contains privacy.html '보유 및 이용 기간' 'Privacy notice states the retention period'
contains privacy.html '동의 거부' 'Privacy notice states refusal rights'
contains privacy.html '만 14세 미만' 'Privacy notice addresses child applicants'

printf '\nMeta campaign readiness\n'
contains meta-ad-plan.md 'Asia/Seoul' 'Meta ad account uses the Seoul time zone'
contains meta-ad-plan.md '통화: `KRW`' 'Meta ad account uses Korean won'
contains meta-ad-plan.md 'Facebook 페이지: `클씨랩 Cloud Security Lab`' 'Meta ad identity is documented'
contains meta-ad-plan.md '광고 계정 ID: `1661899158952556`' 'Meta ad account ID is documented'
contains meta-ad-plan.md 'Facebook 페이지 카테고리: `교육 컨설턴트`' 'Meta Page category is documented'
contains meta-ad-plan.md '일 예산: `20,000원`' 'Meta pilot daily budget is documented'
contains meta-ad-plan.md '최대 계획 지출: `140,000원`' 'Meta pilot maximum planned spend is documented'
contains meta-ad-plan.md 'utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=roblox_youth' 'Meta ad uses the canonical tracked URL'
contains meta-ad-plan.md 'GA4의 `application_submit`' 'Meta plan distinguishes completed applications'
contains meta-ad-plan.md '결제수단 등록과 예산 증액은 담당자가 최종 확인' 'Meta plan preserves approval boundaries'

printf '\nGemini Notebook branding\n'
for file in index.html main.html notebooklm.html poster.html; do
  contains "$file" 'Gemini 노트북' "$file uses the Gemini Notebook course name"
  contains "$file" 'images/gemini-spark\.webp' "$file includes the official Gemini Spark asset"
done
contains notebooklm.html 'Gemini 성공 방정식' 'Notebook detail includes the Gemini success equation'
contains notebooklm.html '내 자료' 'Gemini success equation starts with learner materials'
contains notebooklm.html '근거 확인' 'Gemini success equation includes evidence checking'

printf '\nPromotional video\n'
for file in index.html main.html roblox.html notebooklm.html; do
  contains "$file" 'id="shorts"' "$file exposes the promotional video section"
  contains "$file" 'youtube\.com/shorts/yQYwMZ2udaw' "$file links the prepared promotional video"
  contains "$file" 'images/shorts-cover\.jpg' "$file displays the promotional video cover"
  contains "$file" 'shorts_section_view' "$file tracks promotional video visibility"
  contains "$file" 'shorts_click' "$file tracks promotional video clicks"
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
contains .github/workflows/pages.yml 'actions/setup-node@v6' 'Pages workflow uses the Node 24-compatible setup action'
contains .github/workflows/pages.yml 'node-version: 24' 'Pages workflow pins Node 24'
contains .github/workflows/pages.yml 'run: npm ci' 'Pages workflow installs the pinned CSS build dependency'
contains .github/workflows/pages.yml 'run: npm run build:css' 'Pages workflow rebuilds static landing CSS'
contains .github/workflows/pages.yml "path: 'dist'" 'Pages workflow deploys dist'
contains scripts/build-site.sh 'ga4-events\.js' 'Public build includes the direct GA4 loader'
if [[ -d "$ROOT/dist" ]]; then
  if find "$ROOT/dist" -type f \( -name '*preview*' -o -name 'index-legacy.html' -o -name 'source.html' \) | grep -q .; then
    fail 'Public artifact contains a preview, legacy, or source page'
  else
    pass 'Public artifact excludes preview, legacy, and source pages'
  fi
  if [[ -f "$ROOT/dist/ads/index.html" ]] && [[ -f "$ROOT/dist/ads/meta-enterprise-candidates.zip" ]]; then
    pass 'Public artifact includes the Meta candidate operator page and ZIP'
  else
    fail 'Public artifact is missing the Meta candidate operator page or ZIP'
  fi
  if [[ -f "$ROOT/dist/ads/source.html" ]]; then
    fail 'Public artifact exposes the Meta render source'
  else
    pass 'Public artifact excludes the Meta render source'
  fi
  if [[ -f "$ROOT/dist/styles/main.css" ]] && [[ -f "$ROOT/dist/styles/roblox.css" ]] && [[ -f "$ROOT/dist/styles/notebooklm.css" ]]; then
    pass 'Public artifact includes all compiled landing styles'
  else
    fail 'Public artifact is missing one or more compiled landing styles'
  fi
  if [[ -f "$ROOT/dist/ga4-events.js" ]]; then
    pass 'Public artifact includes the direct GA4 loader'
  else
    fail 'Public artifact is missing the direct GA4 loader'
  fi
else
  warn 'dist is absent; run bash scripts/build-site.sh before publishing'
fi

printf '\nGit hygiene\n'
if git -C "$ROOT" diff --check >/dev/null; then pass 'Working-tree diff has no whitespace errors'; else fail 'Working-tree diff contains whitespace errors'; fi

printf '\nSummary: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
if (( failures > 0 )); then exit 1; fi
