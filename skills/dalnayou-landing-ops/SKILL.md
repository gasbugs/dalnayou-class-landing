---
name: dalnayou-landing-ops
description: Operate, revise, verify, and publish the dalnayou-class-landing GitHub Pages campaign. Use this skill whenever the user asks to change the Dalnayou/Cloud Security Lab landing pages, course pages, A4 poster, card news, payment or confirmation messages, refund copy, QR codes, campaign URLs, UTM/GA4 tracking, mobile layout, print layout, or GitHub Pages deployment, even when they only request a small wording correction.
compatibility: Requires shell tools, git, and curl. Uses gh when available and Chrome or an in-app browser for visual QA when available.
---

# Dalnayou Landing Operations

Run this campaign as a controlled content-and-deployment loop. Small wording changes can affect copied messages, QR attribution, course pages, and printed materials, so identify the true surface first and verify the live result at the end.

## Start here

1. Resolve the repository root with `git rev-parse --show-toplevel`.
2. Read `references/project-map.md` before choosing files.
3. Read `references/operating-plan.md` for the complete loop and definition of done.
4. Read `references/tracking-taxonomy.md` for any QR, UTM, GA4, or channel-link task.
5. Run the bundled `scripts/audit-site.sh <repo-root>` before editing to capture the current baseline.
6. Inspect `git status --short --branch`. Treat unrelated modifications as user work and preserve them.

## Classify the request

Choose the smallest applicable surface:

- Main course chooser: `index.html`; mirror shared changes to `main.html`, preserving its distinct canonical `og:url`.
- Course-specific content: `roblox.html` or `notebooklm.html`.
- Long-form legacy landing: `index-legacy.html` only when the request refers to its sections.
- A4 print handout: `poster.html`.
- Card-news images: `cardnews/source.html`, then regenerate PNG and ZIP outputs.
- Marketing and operator copy: `cardnews/index.html`.
- Refund rules: `refund.html` and matching message copy when explicitly requested.
- Channel links and analytics guidance: `tracking-links.md` plus the destination page if tracking behavior changes.
- Campaign pricing and application attribution: `campaign-pricing.js`, course-page `data-campaign-apply` links, and the existing Google Form attribution field.
- Course-page application links also preselect their matching Google Form course through `entry.240966579`; keep the option text synchronized with the live form.

Search for the exact old phrase across the repository before editing. If it occurs more than once, decide whether those copies represent the same business fact. Update every true duplicate, but do not mechanically replace unrelated historical or format-specific text.

## Execute the operating loop

### 1. Establish scope and invariants

- Restate the requested result briefly in a commentary update.
- Identify mutable campaign facts involved: course, audience, date, time, location, price, deadline, instructor, preparation item, URL, or tracking source.
- Check adjacent facts for contradictions. A change to a date or price usually spans more files than a message wording correction.
- For substantial work, maintain a short plan with one active item.

### 2. Edit conservatively

- Follow the existing HTML, Tailwind, and plain-JavaScript style.
- Use `apply_patch` for manual edits.
- Keep `index.html` and `main.html` behaviorally identical except for intentional metadata differences.
- Keep operator copy warm, specific, and ready to paste. Preserve the exact number of course-specific templates requested by the user.
- Put required URLs inside the copied `textarea`; if a long textarea hides an important resource, also expose it as a visible link outside the textarea.
- For test or preview requests, create or update a preview page and do not merge it into the live landing until the user accepts it.
- Keep the campaign phase names and prices consistent: `1차 얼리버드` 189,000원, `2차 얼리버드` 199,000원, and `파이널 등록` 209,000원.
- Use `campaign-pricing.js` as the runtime source of truth for course-page price, deadline, countdown, and application-form prefill behavior.

### 3. Preserve analytics

- Keep `data-track-event` on actionable elements.
- Application-form links use `apply_click`; inquiry links use `contact_click`; maps use `map_click`.
- Preserve UTM parameters through internal navigation and include source context on click events.
- Preserve `data-campaign-apply` on every application CTA so the existing Google Form receives UTM, landing path, course, campaign phase, and campaign price through `entry.1074868867`.
- Generate channel URLs according to `references/tracking-taxonomy.md` and record reusable links in `tracking-links.md`.
- Give each physical QR source a distinct UTM identity. Encode the full destination URL in the QR and verify the decoded destination, not only the image appearance.
- Explain clearly that `apply_click` measures a click to the form, not a completed form submission.
- Treat `application_submit` as the completed-form event. Never send applicant name, phone number, or other personal data to GA4.
- Keep Meta Pixel initialization in `marketing-events.js`. `ApplyClick` means the visitor opened the application form; do not report it as a completed application.

### 4. Protect mobile and print layouts

- Check narrow mobile widths first because most visitors arrive on phones.
- Keep each course's heading, schedule, curriculum, and CTA visually grouped; do not interleave course content on mobile.
- Prevent fixed controls, sticky CTAs, long Korean words, or copied URLs from overlapping content.
- For `poster.html`, preserve A4 portrait dimensions (`210mm × 297mm`), `@page`, print colors, and the visible screen-only print button.
- Ensure `.no-print` controls disappear only in print, not on narrow screens.
- When removing a block from the poster, deliberately redistribute the released space instead of leaving a large gap.

### 5. Regenerate derived assets

When `cardnews/source.html` changes:

1. Run `scripts/render-cardnews.sh`.
2. Verify all 8 Instagram images at 1080×1350.
3. Verify all 8 Daangn images at 1080×1080.
4. Confirm both ZIP archives were regenerated.
5. Inspect representative first, middle, and last cards for clipping and overlap.

Do not regenerate card images for changes limited to `cardnews/index.html` operator messages.

### 6. Verify before publishing

Run:

```bash
skills/dalnayou-landing-ops/scripts/audit-site.sh "$(git rev-parse --show-toplevel)"
bash scripts/build-site.sh
git diff --check
git diff -- <files-you-changed>
git status --short --branch
```

Confirm that `dist/` contains only the public allowlist. Preview pages, legacy pages, card-news source HTML, skills, internal documentation, and operator-only files must not be deployed.

Then perform proportional visual QA:

- Mobile landing: about 390×844.
- Desktop landing: about 1440×1000.
- A4 poster: print preview or PDF at A4 portrait.
- Card news: native output dimensions.

Use the in-app browser when available. If it is unavailable, report that limitation and still complete structural checks. Do not claim visual verification you did not perform.

### 7. Commit and publish safely

- Stage only files changed for the current request.
- Never stage, revert, or rewrite unrelated dirty files.
- Use a focused imperative commit message.
- Push `main` when the user requested a live-site change or the ongoing conversation clearly treats each accepted change as a publication. Do not publish a preview awaiting approval.
- GitHub Pages publishes the `dist/` artifact built by `scripts/build-site.sh`; do not upload the repository root.
- If `gh` exists, inspect the newest `pages.yml` run and wait for success.
- If `gh` is unavailable, poll the exact public URL with a cache-busting query until the new distinguishing text appears.
- Verify the live page itself; a successful push alone is not proof of deployment.

### 8. Close the loop

Report the user-visible change, live URL, tracking identity when relevant, and any verification limitation. Keep the final response concise; the user needs the result and link, not a transcript of every command.

## Operational safeguards

- Never expose bank details, phone numbers, or applicant data beyond content the user explicitly placed on the public page.
- Do not infer that a form was submitted from `apply_click`.
- Do not silently change price, refund, deadline, or schedule facts while editing design.
- Do not let a cache hit masquerade as a successful deployment; add a unique query parameter when checking live HTML.
- Do not use destructive git commands.

## Maintenance

Update this skill when the repository gains a new public surface, tracking event, campaign naming rule, rendering command, or deployment mechanism. Add a corresponding eval to `evals/evals.json` whenever a real production correction reveals a missing rule.
