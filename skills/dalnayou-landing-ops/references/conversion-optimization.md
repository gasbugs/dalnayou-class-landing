# Conversion Optimization

Use this loop when the user asks why applications are low or requests landing, form,
advertisement, CTA, or trust improvements.

## Funnel

Measure the campaign in this order:

1. Advertisement impression and link click
2. Landing-page view
3. Course selection only when the visitor lands on the chooser
4. Trust-section view
5. Application-form click
6. Completed application
7. Confirmed payment

Use two web paths rather than forcing all traffic through one closed sequential funnel:

- Chooser path: chooser `page_view` → `course_click` → course-page `apply_click`
- Direct-course path: `course_landing_view` → `apply_click`

Also report absolute `apply_click` and `application_submit` counts independently. An ad that
lands on `roblox.html` or `notebooklm.html` cannot emit the chooser's `course_click`, so a
closed funnel that requires that event produces a false zero for valid direct-course traffic.
Each detail page sends `course_landing_view` with `course_selection=roblox|notebooklm`.

`apply_click` is intent, not a completed application. `application_submit` is a form
submission, not revenue. Only `payment_confirmed` is a confirmed enrolment.

## Before editing

1. Choose an exact date range and traffic source.
2. Record spend, impressions, clicks, landing views, CTA clicks, submissions, and payments.
   Append the immutable quantitative snapshot to `marketing/snapshots.jsonl`, then run
   `node scripts/analyze-marketing-funnel.mjs --write`.
3. Exclude operator tests, debug traffic, foreign traffic, and unqualified Direct traffic.
4. Identify the earliest stage with material loss. Fix that bottleneck first.
5. Write one falsifiable hypothesis in `marketing-history.md`.

Record the latest date that GA4 has fully processed. Do not label the newest visible report
as "today" when GA4 only allows an earlier processed date.

Keep measurement systems separate. Meta landing-page views and GA4 sessions are not the
same cohort even when their date and UTM labels match. Calculate CTR and click-to-landing
inside Meta, and calculate web-event progress inside GA4. Use a cross-system discrepancy
only as a tracking diagnostic, never as a conversion rate.

## Experiment design

- Change one primary variable at a time.
- Give each creative and destination a distinct `utm_content`.
- Give each meaningful CTA position a distinct `data-track-label`.
- Measure each application CTA's `apply_cta_view` with the same `link_position` used by
  `apply_click`. A position click rate is valid only when views and clicks use the same
  page, course, source, and date range.
- Keep budget stable while landing structure changes.
- Keep destination and audience stable when comparing creative whenever possible.
- Match advertisement promise, landing headline, proof, outcome, schedule, price, and CTA.
- For youth courses, distinguish the learner from the payer in both copy and targeting.
- If the live age ceiling excludes parents or working-adult prospects, test widening that
  ceiling as one variable while creative, destination, region, and budget stay fixed.
- Put trust proof before the decision CTA: concise proof near the hero, concrete institutions
  and dates in a dedicated section, then a tracked CTA.
- Reduce perceived commitment by stating the real application and payment process accurately.
- Before changing a form, verify its control types, required fields, branching, and aggregate
  response count in the live editor as well as the public view. Truncated HTML is not enough
  to distinguish checkboxes from a single-choice question.

## Decision rules

- Default minimum observation: 30 paid landing-page views and 48 hours after the change,
  using whichever threshold is reached later.
- A broken link, incorrect campaign fact, or missing tracking event can be fixed immediately.
- If advertisement CTR is weak, improve the promise or creative before adding landing sections.
- If click-to-landing completion is weak, inspect loading, accidental clicks, and message match.
- If landing views are healthy but `apply_click` is weak, improve proof, offer clarity, outcome,
  price justification, schedule fit, and CTA placement.
- If `apply_click` exists but `application_submit` is weak, inspect form length, first-screen
  legal copy, optional fields, course preselection, and mobile usability.
- Do not optimize the form when `apply_click` volume is still below the form-stage threshold;
  there is not enough evidence that the form is the earliest bottleneck.
- If submissions exist but payments do not, inspect payment timing, trust, reminders, and policy
  clarity.
- Use `성공`, `실패`, or `자료 부족`. Never call insufficient data a failure.

## Learning record

Append each experiment to `marketing-history.md` with:

- start and end time
- exact files, ad, audience, destination, and budget involved
- hypothesis and primary metric
- baseline and result
- data limitations
- decision and next action

Do not delete failed experiments or rewrite their original hypothesis. Add a later correction
when new information changes the interpretation.

Keep quantitative observations separate from interpretation:

- `marketing/snapshots.jsonl`: append-only raw counts and source-system limitations
- `marketing-report.md`: deterministic generated rates and sample-readiness checks
- `marketing-history.md`: hypotheses, changes, qualitative evidence, decisions, and lessons

For a CTA-position observation, append a normal snapshot record and add:

```json
{
  "content": "roblox_mobile_form",
  "course": "roblox",
  "link_position": "roblox_mobile_form",
  "apply_cta_views": 42,
  "apply_clicks": 3,
  "source_systems": ["ga4"]
}
```

Use only a fully processed GA4 period. An absent metric means pending data; it must not be
silently converted to zero.
