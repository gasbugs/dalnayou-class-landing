# Project Map

## Public surfaces

| File | Responsibility | Update when |
| --- | --- | --- |
| `index.html` | Primary two-course chooser | Course positioning, shared price badges, navigation, tracking |
| `main.html` | Alternate chooser mirror | Mirror `index.html` behavior; preserve `main.html` OG URL |
| `roblox.html` | Roblox AI detail page | Roblox audience, curriculum, schedule, CTA, location |
| `notebooklm.html` | Gemini 노트북 detail page | Gemini 노트북 audience, curriculum, schedule, CTA, location |
| `index-legacy.html` | Long-form legacy landing | User explicitly references sections that only exist here |
| `poster.html` | A4 print handout | Print copy, QR, print button, A4 spacing |
| `refund.html` | Public refund policy | Refund rules or policy links |
| `privacy.html` | Public application privacy notice | Consent summary, collected fields, retention, refusal rights, child applicant rules |
| `cardnews/index.html` | Card-news hub and copy tools | Ad copy, payment/confirmation/refund messages, resource links |
| `cardnews/source.html` | Render source for social cards | Text or design printed into PNG assets |
| `ads/index.html` | Noindex operator preview for Meta replacement candidates | Candidate PNG downloads, paste-ready copy, tracked URLs |
| `ads/source.html` | Local render source for Meta feed and story candidates | Candidate creative text or design changes |
| `tracking-links.md` | Campaign URL registry and GA/GTM notes | New channels, UTM naming, event inventory |
| `marketing-history.md` | Append-only conversion baseline, experiments, failures, and decisions | Advertisement, CTA, form, or conversion work |
| `marketing/snapshots.jsonl` | Append-only raw funnel counts with source-system limitations | A new Meta, GA4, form, or payment observation is available |
| `marketing-report.md` | Generated funnel rates and sample-readiness assessment | Regenerate after appending a snapshot |
| `course-operations.md` | Internal application, payment, seat, and learner operations checklist | Registration operations or staffing rules change |
| `campaign-pricing.js` | Shared phased price and form-attribution runtime | Price, deadline, form field, or phase changes |
| `ga4-events.js` | Shared direct GA4 loader and custom-event sender | Measurement ID or GA4 delivery behavior changes |
| `marketing-events.js` | Shared Meta Pixel loader and web behavior events | Pixel ID or Meta event mapping changes |
| `integrations/google-apps-script/track-application-submit.gs` | Version-controlled source for the live Google Form submission trigger | Submission attribution or GA4 Measurement Protocol fields change |
| `styles/main.css` | Compiled Tailwind CSS for the two-course chooser | Rebuild after chooser utility-class changes |
| `styles/roblox.css` | Compiled Tailwind CSS for Roblox detail | Rebuild after Roblox utility-class changes |
| `styles/notebooklm.css` | Compiled Tailwind CSS for Gemini Notebook detail | Rebuild after Notebook utility-class changes |
| `scripts/build-tailwind-css.sh` | Deterministic static Tailwind compiler | Tailwind config, page scope, or CSS output changes |
| `scripts/build-site.sh` | Public deployment allowlist | Public pages or required runtime assets change |

## Derived assets

- `cardnews/png/instagram-*.png`: 8 files, 1080×1350.
- `cardnews/png/daangn-*.png`: 8 files, 1080×1080.
- `cardnews/instagram-cardnews-png.zip`.
- `cardnews/daangn-cardnews-png.zip`.
- Regenerate with `scripts/render-cardnews.sh` after editing `cardnews/source.html`.
- `ads/png/meta-*-enterprise-feed.png`: 1080×1350 Meta feed candidates.
- `ads/png/meta-*-enterprise-story.png`: 1080×1920 Meta story and Reels candidates.
- `ads/meta-enterprise-candidates.zip`.
- Regenerate with `scripts/render-meta-ads.sh` after editing `ads/source.html`.

## Shared invariants

- `index.html` and `main.html` should differ only where metadata intentionally points to their own URL.
- The morning course public name is `Gemini 노트북`, while `Google NotebookLM` remains the factual tool name in supporting copy.
- The legacy `notebooklm.html` URL, analytics labels, internal course key, and exact Google Form option stay stable for compatibility.
- Both main chooser mirrors and both course detail pages expose the prepared YouTube short and emit `shorts_section_view` and `shorts_click`.
- The main chooser and both detail pages load committed static Tailwind CSS and must not depend on Tailwind Play CDN at runtime.
- Both chooser hero images are eager because both are visible in the first mobile and desktop viewport.
- Course detail pages retain `apply_click` on every application CTA.
- Enterprise teaching proof appears near the first CTA and in a dedicated trust section with a uniquely labelled application CTA.
- Course detail pages preselect the matching Google Form course while retaining the automatic attribution field.
- Each application CTA persists its unique position into the automatic attribution field,
  and the live Apps Script forwards that `link_position` with `application_submit`.
- Current pages include GTM container `GTM-KVC6H3SL`, but its published container had zero
  tags on 2026-07-25. Direct GA4 delivery therefore remains required.
- Every public page loads `ga4-events.js`; pages with tracked actions call
  `dalnayouSendGa4` in addition to retaining their data-layer record.
- Current public pages use Meta Pixel `2173864043186723`; `ApplyClick` is a form click, not a completed application.
- UTM/source context survives main-to-detail navigation for the session.
- The A4 poster intentionally omits price and sends QR traffic with a print-specific UTM.
- `cardnews/index.html` keeps two payment-request and two confirmation templates, one per course.
- Important resource URLs appear inside copied text, not only as clickable UI.
- Course prices advance automatically: 189,000원 through 8/1, 199,000원 from 8/2 through 8/8, and 209,000원 from 8/9 through 8/15.
- Meta replacement candidates use a unique `utm_content` and may be prepared during an active observation window, but must not be published until the documented sample, time, and approval conditions are met.
- Preview, legacy, source, and skill files remain in the repository but are excluded from the `dist/` deployment artifact.

## Existing commands

```bash
./scripts/render-cardnews.sh
./scripts/render-meta-ads.sh
npm ci
npm run build:css
bash scripts/build-site.sh
skills/dalnayou-landing-ops/scripts/audit-site.sh .
git diff --check
```

GitHub Pages builds and deploys `dist/` on pushes to `main` through `.github/workflows/pages.yml`.
