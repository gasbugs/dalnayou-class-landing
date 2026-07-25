# Conversion Optimization

Use this loop when the user asks why applications are low or requests landing, form,
advertisement, CTA, or trust improvements.

## Funnel

Measure the campaign in this order:

1. Advertisement impression and link click
2. Landing-page view
3. Course selection when the visitor lands on the chooser
4. Trust-section view
5. Application-form click
6. Completed application
7. Confirmed payment

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

## Experiment design

- Change one primary variable at a time.
- Give each creative and destination a distinct `utm_content`.
- Give each meaningful CTA position a distinct `data-track-label`.
- Keep budget stable while landing structure changes.
- Keep destination and audience stable when comparing creative whenever possible.
- Match advertisement promise, landing headline, proof, outcome, schedule, price, and CTA.
- For youth courses, distinguish the learner from the payer in both copy and targeting.
- Put trust proof before the decision CTA: concise proof near the hero, concrete institutions
  and dates in a dedicated section, then a tracked CTA.
- Reduce perceived commitment by stating the real application and payment process accurately.

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
