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
  scripts/evaluate-campaign-actions.mjs
  scripts/evaluate-campaign-actions.test.mjs
  marketing/experiments.json experiments/e-007-mobile-cta-preview.html
  experiments/e-011-notebook-workload-ad-preview.html
  experiments/assets/e-011-notebook-workload-feed.png
  experiments/assets/e-011-notebook-workload-story.png
  experiments/assets/notebooklm-workplace-generic-v2.webp
  scripts/render-e011-notebook-workload.sh
  integrations/google-apps-script/track-application-submit.gs
  ga4-events.js marketing-events.js images/roblox-creator-cole-tucker.webp
  images/gemini-spark.webp
  images/cloud-security-lab-logo.webp
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
contains ga4-events.js 'hostname === "localhost".*hostname === "127\.0\.0\.1"' 'Shared GA4 loader excludes local QA traffic'
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
contains roblox.html "track\\('course_landing_view'" 'Roblox sends a GA4 course landing event'
contains roblox.html "course_selection: 'roblox'" 'Roblox course landing identifies its course'
contains notebooklm.html "track\\('course_landing_view'" 'NotebookLM sends a GA4 course landing event'
contains notebooklm.html "course_selection: 'notebooklm'" 'NotebookLM course landing identifies its course'
contains roblox.html 'data-track-event="apply_click"[^>]*data-course-selection="roblox"' 'Roblox apply CTAs identify their course'
contains notebooklm.html 'data-track-event="apply_click"[^>]*data-course-selection="notebooklm"' 'NotebookLM apply CTAs identify their course'
contains roblox.html "course_selection: target.dataset.courseSelection || 'roblox'" 'Roblox tracked clicks include their course'
contains notebooklm.html "course_selection: target.dataset.courseSelection || 'notebooklm'" 'NotebookLM tracked clicks include their course'
roblox_apply_course_count="$(rg -c 'data-track-event="apply_click"[^>]*data-course-selection="roblox"' "$ROOT/roblox.html" || true)"
notebook_apply_course_count="$(rg -c 'data-track-event="apply_click"[^>]*data-course-selection="notebooklm"' "$ROOT/notebooklm.html" || true)"
if [[ "$roblox_apply_course_count" == "4" ]]; then pass 'All four Roblox apply CTAs identify their course'; else fail "Expected 4 course-tagged Roblox apply CTAs, found $roblox_apply_course_count"; fi
if [[ "$notebook_apply_course_count" == "4" ]]; then pass 'All four NotebookLM apply CTAs identify their course'; else fail "Expected 4 course-tagged NotebookLM apply CTAs, found $notebook_apply_course_count"; fi
contains roblox.html "track\\('apply_cta_view'" 'Roblox measures application CTA visibility'
contains notebooklm.html "track\\('apply_cta_view'" 'NotebookLM measures application CTA visibility'
contains roblox.html 'applyCtaObserver\.unobserve\(target\)' 'Roblox application CTA views are one-time'
contains notebooklm.html 'applyCtaObserver\.unobserve\(target\)' 'NotebookLM application CTA views are one-time'
contains roblox.html 'threshold: 0\.6' 'Roblox application CTA visibility uses a stable threshold'
contains notebooklm.html 'threshold: 0\.6' 'NotebookLM application CTA visibility uses a stable threshold'
contains index.html 'data-course-selection="notebooklm"' 'Main landing identifies Notebook course selections'
contains index.html 'data-course-selection="roblox"' 'Main landing identifies Roblox course selections'
contains main.html 'data-course-selection="notebooklm"' 'Main mirror identifies Notebook course selections'
contains main.html 'data-course-selection="roblox"' 'Main mirror identifies Roblox course selections'
contains index.html 'course_selection: target.dataset.courseSelection' 'GA4 course clicks include the selected course'
contains main.html 'course_selection: target.dataset.courseSelection' 'GA4 mirror course clicks include the selected course'
contains marketing-events.js 'params.course_selection = getTargetCourse\(target\)' 'Meta ApplyClick identifies its course'
contains marketing-events.js 'params.course_selection = params.content_name' 'Meta CourseSelect includes the selected course'
contains roblox.html 'data-track-label="roblox_enterprise_trust_form"' 'Roblox trust proof has a distinct application CTA'
contains notebooklm.html 'data-track-label="notebooklm_enterprise_trust_form"' 'NotebookLM trust proof has a distinct application CTA'
for file in index.html main.html roblox.html notebooklm.html; do
  not_contains "$file" 'cdn\.tailwindcss\.com' "$file does not depend on Tailwind Play CDN"
done
contains index.html 'styles/main\.css' 'Main landing loads compiled Tailwind CSS'
contains main.html 'styles/main\.css' 'Main mirror loads compiled Tailwind CSS'
contains roblox.html 'styles/roblox\.css' 'Roblox page loads compiled Tailwind CSS'
contains notebooklm.html 'styles/notebooklm\.css' 'Notebook page loads compiled Tailwind CSS'
for file in index.html main.html roblox.html notebooklm.html poster.html; do
  contains "$file" 'cloud-security-lab-logo\.webp' "$file uses the optimized logo"
  not_contains "$file" 'cloud-security-lab-logo\.png' "$file does not load the oversized logo"
done
optimized_logo_bytes="$(wc -c < "$ROOT/images/cloud-security-lab-logo.webp" | tr -d ' ')"
if (( optimized_logo_bytes <= 16384 )); then
  pass 'Optimized public logo stays within the 16 KiB budget'
else
  fail "Optimized public logo exceeds the 16 KiB budget (${optimized_logo_bytes} bytes)"
fi
contains index.html 'loading="eager" fetchpriority="high".*notebooklm|notebooklm[^>]*loading="eager" fetchpriority="high"' 'Main landing prioritizes the Notebook hero image'
contains main.html 'loading="eager" fetchpriority="high".*notebooklm|notebooklm[^>]*loading="eager" fetchpriority="high"' 'Main mirror prioritizes the Notebook hero image'
contains marketing-history.md 'payment_confirmed' 'Marketing history tracks confirmed payments as the final conversion'
contains marketing-history.md '자료 부족' 'Marketing history distinguishes insufficient data from failure'
contains marketing-report.md '클씨랩 AI 클래스 퍼널 보고서' 'Generated marketing funnel report exists'
contains marketing-report.md '자료 부족' 'Generated report enforces sample-readiness language'
contains marketing-report.md '실험 실행 게이트' 'Generated report shows queued experiment gates'
contains marketing-report.md '강좌 상세 직접 유입은 `course_click`을 요구하지 않고 `course_landing_view → apply_click`' 'Generated report separates direct-course measurement'
contains marketing-report.md 'apply_cta_view → apply_click' 'Generated report defines CTA position conversion'
contains marketing-report.md 'CTA 위치별 성과' 'Generated report includes CTA position performance'
if rg -q -- '아직 수집된 CTA 위치 스냅샷이 없습니다' "$ROOT/marketing-report.md"; then
  pass 'Generated report shows an explicit empty CTA state'
elif rg -q -- '"apply_cta_views":[1-9][0-9]*' "$ROOT/marketing/snapshots.jsonl" \
  && rg -q -- '^\| .* \| .* \| [1-9][0-9]* \| (—|[0-9]+) \| (—|[0-9.]+%) \| [^|]+ \|$' "$ROOT/marketing-report.md"; then
  pass 'Generated report uses observed CTA data'
else
  fail 'Generated report invents or omits CTA data'
fi
contains scripts/analyze-marketing-funnel.mjs '"apply_cta_views"' 'Marketing analyzer accepts CTA view counts'
contains marketing/experiments.json 'experiments/e-007-mobile-cta-preview\.html' 'E-007 references its internal preview'
contains marketing-report.md 'experiments/e-007-mobile-cta-preview\.html' 'Generated report exposes the E-007 preview path'
contains marketing/experiments.json 'candidate_form_description' 'E-010 has an exact candidate form description'
contains marketing/experiments.json 'baseline_form_description' 'E-010 preserves the exact live Form description for rollback'
contains marketing/experiments.json 'Replace only the Google Form description' 'E-010 keeps form questions and legal consent stable'
contains marketing/experiments.json '가격·환불·상세 안내' 'E-010 retains a detailed information path'
contains marketing/experiments.json '"restore": "baseline_form_description"' 'E-010 defines a deterministic rollback'
contains marketing/experiments.json 'at least 10 additional qualified apply clicks' 'E-010 waits for a post-change evaluation sample'
contains marketing/experiments.json 'experiments/e-011-notebook-workload-ad-preview\.html' 'E-011 references its internal preview'
contains marketing/experiments.json 'notebooklm_workload_candidate_v2' 'E-011 reserves a unique candidate content value'
contains marketing/experiments.json '\[Codex\] Gemini노트북_업무문서문제_v2' 'E-011 has a Codex-prefixed launch ad name'
contains marketing/experiments.json 'utm_content=notebooklm_workload_candidate_v2' 'E-011 launch URL uses its unique content value'
contains marketing/experiments.json 'Pause only the superseded Gemini ad after the new ad is active' 'E-011 launch sequence avoids a delivery gap'
contains marketing/experiments.json 'experiments/assets/e-011-notebook-workload-feed\.png' 'E-011 references its feed upload asset'
contains marketing/experiments.json 'experiments/assets/e-011-notebook-workload-story\.png' 'E-011 references its story upload asset'
contains marketing/experiments.json 'experiments/assets/notebooklm-workplace-generic-v2\.webp' 'E-011 references its logo-free workplace source'
contains experiments/e-011-notebook-workload-ad-preview.html 'assets/notebooklm-workplace-generic-v2\.webp' 'E-011 preview uses its logo-free workplace source'
not_contains experiments/e-011-notebook-workload-ad-preview.html 'docusign' 'E-011 preview excludes the third-party branded workplace image'
contains marketing-report.md 'experiments/e-011-notebook-workload-ad-preview\.html' 'Generated report exposes the E-011 preview path'
contains marketing-report.md 'experiments/assets/e-011-notebook-workload-feed\.png' 'Generated report exposes the E-011 feed upload asset'
contains marketing-report.md 'experiments/assets/e-011-notebook-workload-story\.png' 'Generated report exposes the E-011 story upload asset'
contains marketing-report.md '\[Codex\] Gemini노트북_업무문서문제_v2' 'Generated report exposes the E-011 launch ad name'
contains marketing-report.md 'utm_content=notebooklm_workload_candidate_v2' 'Generated report exposes the E-011 launch destination'
require_png_dimensions experiments/assets/e-011-notebook-workload-feed.png '1080 x 1350'
require_png_dimensions experiments/assets/e-011-notebook-workload-story.png '1080 x 1920'
contains marketing/experiments.json 'experiments/e-012-roblox-real-output-ad-preview\.html' 'E-012 references its internal preview'
contains marketing/experiments.json 'roblox_real_output_candidate_v2' 'E-012 reserves a unique candidate content value'
contains marketing/experiments.json '\[Codex\] 로블록스AI_실제결과물_v2' 'E-012 has a Codex-prefixed launch ad name'
contains marketing/experiments.json 'utm_content=roblox_real_output_candidate_v2' 'E-012 launch URL uses its unique content value'
contains marketing/experiments.json 'Pause only the superseded Roblox ad after the new ad is active' 'E-012 launch sequence avoids a delivery gap'
contains marketing/experiments.json 'experiments/assets/e-012-roblox-real-output-feed\.png' 'E-012 references its feed upload asset'
contains marketing/experiments.json 'experiments/assets/e-012-roblox-real-output-story\.png' 'E-012 references its story upload asset'
contains experiments/e-012-roblox-real-output-ad-preview.html 'house2-v3\.webp' 'E-012 preview shows the first-week result'
contains experiments/e-012-roblox-real-output-ad-preview.html 'park-v2\.webp' 'E-012 preview shows the mini-game result'
contains experiments/e-012-roblox-real-output-ad-preview.html 'publish-v2\.webp' 'E-012 preview shows the published-game result'
contains marketing-report.md 'experiments/e-012-roblox-real-output-ad-preview\.html' 'Generated report exposes the E-012 preview path'
contains marketing-report.md 'experiments/assets/e-012-roblox-real-output-feed\.png' 'Generated report exposes the E-012 feed upload asset'
contains marketing-report.md 'experiments/assets/e-012-roblox-real-output-story\.png' 'Generated report exposes the E-012 story upload asset'
contains marketing-report.md '\[Codex\] 로블록스AI_실제결과물_v2' 'Generated report exposes the E-012 launch ad name'
contains marketing-report.md 'utm_content=roblox_real_output_candidate_v2' 'Generated report exposes the E-012 launch destination'
require_png_dimensions experiments/assets/e-012-roblox-real-output-feed.png '1080 x 1350'
require_png_dimensions experiments/assets/e-012-roblox-real-output-story.png '1080 x 1920'
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
contains campaign-pricing.js 'link_position:' 'Application links persist the CTA position'
contains campaign-pricing.js 'link\.dataset\.trackLabel' 'Application attribution uses each CTA tracking label'
contains integrations/google-apps-script/track-application-submit.gs "link_position: attribution\.link_position" 'Form submissions send the CTA position to GA4'
contains integrations/google-apps-script/track-application-submit.gs "'link_position'" 'Apps Script allows the CTA position'
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
contains marketing-events.js 'hostname === "localhost".*hostname === "127\.0\.0\.1"' 'Meta Pixel excludes local QA traffic'
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
for file in index.html main.html; do
  contains "$file" '잔여석 마감 임박' "$file uses a non-numeric urgency label"
  not_contains "$file" '선착순 5명' "$file does not contradict the 15-person capacity"
done
contains course-operations.md '최소 개강 인원은 6명' 'Operations distinguish the six-person minimum'
contains course-operations.md '정원은 15명' 'Operations use the 15-person capacity'
contains course-operations.md '15 - 입금 확인 인원' 'Operations calculate remaining seats from capacity 15'
contains emergency-recruitment-plan.md '입금 6명은 개강 최소 인원이며 광고 중단 기준이 아닙니다' 'Emergency plan keeps advertising after minimum enrollment'
contains emergency-recruitment-plan.md '정원 15명에 도달한 과정의 광고 세트만 즉시 중단' 'Emergency plan stops only at course capacity'
contains meta-ad-plan.md '6명에 도달해도' 'Meta plan keeps advertising after minimum enrollment'
contains meta-ad-plan.md '정원 15명에 도달한 과정의 광고 세트만 중단' 'Meta plan stops only at course capacity'
contains course-operations.md '입금 6명에 도달하면 개강 기준을 충족' 'Course operations treat six paid learners as the minimum'
contains course-operations.md '입금 확인 인원이 15명에 도달한 과정의 광고를 중단' 'Course operations stop ads at course capacity'
contains tracking-links.md '입금 6명은 개강 기준이며 광고는 계속 운영' 'Tracking guide keeps advertising after minimum enrollment'
contains tracking-links.md '입금 15명 정원에 도달한 과정의 광고 세트만 중단' 'Tracking guide stops only at course capacity'
contains scripts/analyze-marketing-funnel.mjs 'paymentConfirmed >= advertisingStopPaidAt' 'Marketing analyzer honors an explicit campaign stop target'
contains scripts/analyze-marketing-funnel.mjs 'minimumEnrollment.*개강 기준.*advertisingStopPaidAt.*광고 중단 기준.*capacity.*과정 정원' 'Marketing report distinguishes enrollment, ad-stop, and capacity thresholds'
not_contains scripts/analyze-marketing-funnel.mjs 'paymentConfirmed >= minimumEnrollment' 'Marketing analyzer does not stop ads at the minimum enrollment'
contains scripts/record-course-payments.mjs 'value > capacity' 'Payment recorder rejects counts above course capacity'
contains scripts/record-course-payments.mjs 'STATE_SCRIPT' 'Payment recorder refreshes the compact current state'
contains scripts/update-current-state.mjs 'allCourseCountsKnown' 'Current state totals payments only when both course counts are known'
contains scripts/update-current-state.mjs 'Do not infer the missing course count' 'Current state preserves unknown course payment counts'
contains scripts/update-current-state.mjs 'latestByContent\.get\("ga4_today_processed_mixed"\)' 'Current state refreshes the latest GA4 observation'
contains scripts/update-current-state.mjs '"partial_day"' 'Current state distinguishes partial-day GA4 data'
contains scripts/update-current-state.mjs 'processed_apply_clicks' 'Current state preserves course-level processed apply clicks'
contains scripts/update-current-state.mjs 'qualified_apply_clicks' 'Current state preserves qualified local apply clicks'
contains scripts/update-current-state.mjs 'window: "campaign_observation"' 'Current state labels the Meta observation window'
contains scripts/evaluate-campaign-actions.mjs 'paid_confirmed >= course\.advertising_stop_paid_at' 'Decision tool stops a course only at capacity'
contains scripts/evaluate-campaign-actions.mjs 'apply_e010_description' 'Decision tool evaluates the E-010 form gate'
contains scripts/evaluate-campaign-actions.mjs 'launch_e011_then_pause_v1' 'Decision tool evaluates the E-011 creative gate'
contains scripts/evaluate-campaign-actions.mjs 'skip_e011_course_full' 'Decision tool prioritizes capacity stop over creative replacement'
contains scripts/evaluate-campaign-actions.mjs 'hold_e011_during_form_test' 'Decision tool avoids simultaneous form and creative changes'
contains scripts/evaluate-campaign-actions.mjs 'monitor_e011_published_candidate' 'Decision tool does not relaunch an already published E-011 candidate'
contains scripts/evaluate-campaign-actions.mjs 'qualifiedApplyClicks <= e011\.baseline\.qualified_apply_clicks' 'Decision tool uses qualified clicks for the E-011 gate'
not_contains scripts/evaluate-campaign-actions.mjs 'processed_apply_clicks <= e011\.baseline\.processed_apply_clicks' 'Decision tool does not use unqualified raw clicks for the E-011 gate'
contains scripts/evaluate-campaign-actions.test.mjs 'qualified local apply evidence holds the Gemini replacement' 'Decision tests preserve a proven local conversion'
contains scripts/evaluate-campaign-actions.mjs 'launch_e012_then_pause_v1' 'Decision tool evaluates the E-012 creative gate'
contains scripts/evaluate-campaign-actions.mjs 'skip_e012_course_full' 'Decision tool prioritizes Roblox capacity stop over E-012'
contains scripts/evaluate-campaign-actions.mjs 'hold_e012_during_form_test' 'Decision tool holds E-012 during a Form experiment'
contains scripts/evaluate-campaign-actions.mjs 'monitor_e012_published_candidate' 'Decision tool does not relaunch an already published E-012 candidate'
contains scripts/evaluate-campaign-actions.mjs 'qualifiedApplyClicks <= e012\.baseline\.qualified_apply_clicks' 'Decision tool uses qualified Roblox clicks for the E-012 gate'
not_contains scripts/evaluate-campaign-actions.mjs 'processed_apply_clicks <= e012\.baseline\.processed_apply_clicks' 'Decision tool does not use unqualified raw clicks for the E-012 gate'
contains scripts/evaluate-campaign-actions.test.mjs 'Roblox replacement launches after its gate with stagnant qualified clicks' 'Decision tests launch E-012 only after its gate'
contains scripts/evaluate-campaign-actions.test.mjs 'Roblox capacity stop takes priority over E-012' 'Decision tests preserve the Roblox capacity stop'
contains marketing/experiments.json '"qualified_apply_clicks": 0' 'E-011 stores a qualified-click baseline'
contains package.json 'marketing:decide' 'Package exposes the campaign decision command'
contains package.json 'marketing:test' 'Package exposes campaign decision regression tests'
contains cardnews/index.html 'id="payment-tracker"' 'Operator page exposes the privacy-safe payment tracker'
not_contains cardnews/index.html '달나유 일요 AI 클래스에 신청' 'Operator messages do not present the venue as the class operator'
contains cardnews/index.html '클씨랩 일요 AI 클래스에 신청' 'Operator messages identify Cloud Security Lab as the class operator'
contains cardnews/index.html 'const MINIMUM_ENROLLMENT = 6' 'Payment tracker uses the six-person minimum enrollment'
contains cardnews/index.html 'const COURSE_CAPACITY = 15' 'Payment tracker uses the 15-person course capacity'
contains cardnews/index.html 'paid >= COURSE_CAPACITY' 'Payment tracker stops advertising only at course capacity'
not_contains cardnews/index.html 'value >= MINIMUM_ENROLLMENT.*광고 중단' 'Payment tracker does not stop advertising at minimum enrollment'
contains cardnews/index.html '신청자 개인정보는 포함하지 않았습니다' 'Payment tracker copy excludes applicant PII'
contains cardnews/index.html 'window\.localStorage\.setItem\(STORAGE_KEY' 'Payment tracker persists counts locally'
contains cardnews/index.html 'id="confirmed-notebooklm"' 'Payment tracker records Notebook confirmation-message sends'
contains cardnews/index.html 'id="confirmed-roblox"' 'Payment tracker records Roblox confirmation-message sends'
contains cardnews/index.html 'paid - confirmations' 'Payment tracker shows unsent confirmation messages'
contains scripts/record-course-payments.mjs 'cannot exceed the paid count' 'Confirmation recorder rejects sends above paid enrollment'
contains cardnews/index.html 'id="outreach-copy"' 'Operator page exposes direct outreach copy'
contains cardnews/index.html 'utm_source=existing_network' 'Existing-network outreach has a distinct source'
contains cardnews/index.html 'utm_source=enterprise_network' 'Enterprise outreach has a distinct source'
contains cardnews/index.html 'utm_source=apartment_chat' 'Local-community outreach has a distinct source'
contains cardnews/index.html 'utm_source=facebook_page&amp;utm_medium=organic_social' 'Facebook Page organic outreach has a distinct source'
contains cardnews/index.html 'notebooklm_workload_organic_20260727' 'Gemini follow-up post has a distinct organic content value'
contains tracking-links.md 'notebooklm_workload_organic_20260727' 'Tracking guide records the Gemini follow-up post URL'
contains marketing/current-state.json '"facebook_page_follow_up_post"' 'Current state records the Gemini organic follow-up post'
contains marketing/current-state.json 'The paid-promotion switch was off' 'Gemini follow-up post remains unpaid'
contains cardnews/index.html 'roblox_creator_organic_20260727' 'Roblox follow-up post has a distinct organic content value'
contains cardnews/index.html '수익은 보장되지 않습니다' 'Roblox creator copy avoids an earnings guarantee'
contains tracking-links.md 'roblox_creator_organic_20260727' 'Tracking guide records the Roblox follow-up post URL'
contains marketing/current-state.json '"facebook_page_roblox_follow_up_post"' 'Current state records the Roblox organic follow-up post'
contains marketing/current-state.json 'pfbid02xJDYmDJkuAd7ZXugNpQ3W5Aj5iT245cPbzEUvwPqW1tTtDwbTVtcG699zNu2PRFDl' 'Current state records the verified Roblox post permalink'
contains cardnews/index.html 'combined_launch_post_notebooklm' 'Facebook Page post distinguishes the Notebook destination'
contains cardnews/index.html 'combined_launch_post_roblox' 'Facebook Page post distinguishes the Roblox destination'
contains cardnews/index.html 'utm_content=notebooklm_enterprise_emergency' 'Notebook Facebook copy uses the live emergency UTM'
contains cardnews/index.html 'utm_content=roblox_enterprise_emergency' 'Roblox Facebook copy uses the live emergency UTM'
not_contains cardnews/index.html '달나유 이음센터' 'Operator messages use the current venue name'
contains ads/source.html '잔여석 마감 임박' 'Meta creative uses non-numeric urgency'
not_contains ads/source.html '소수정예 5명|선착순 5명' 'Meta creative does not claim a false five-person limit'
not_contains ads/index.html '소수정예 5명|선착순 5명' 'Meta copy does not claim a false five-person limit'

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
  if [[ -f "$ROOT/dist/images/cloud-security-lab-logo.webp" ]] && [[ ! -f "$ROOT/dist/images/cloud-security-lab-logo.png" ]]; then
    pass 'Public artifact ships only the optimized logo'
  else
    fail 'Public artifact logo allowlist is not optimized'
  fi
else
  warn 'dist is absent; run bash scripts/build-site.sh before publishing'
fi

printf '\nGit hygiene\n'
if git -C "$ROOT" diff --check >/dev/null; then pass 'Working-tree diff has no whitespace errors'; else fail 'Working-tree diff contains whitespace errors'; fi

printf '\nSummary: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
if (( failures > 0 )); then exit 1; fi
