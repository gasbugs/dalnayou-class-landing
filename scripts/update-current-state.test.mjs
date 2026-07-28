import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("next decision also refreshes completion-audit evidence time", () => {
  const nextDecision = "2026-07-28T14:00:00+09:00";
  const output = execFileSync(
    process.execPath,
    [
      "scripts/update-current-state.mjs",
      "--dry-run",
      "--next-decision",
      nextDecision,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );
  const state = JSON.parse(output);

  assert.equal(state.next_decision.at, nextDecision);
  assert.ok(
    state.completion_audit.next_required_evidence.includes(
      `Meta, GA4 and Google Form counts at the next scheduled review on ${nextDecision}.`,
    ),
  );
});

test("latest active-ad landing views replace stale candidate detail", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/update-current-state.mjs", "--dry-run"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );
  const state = JSON.parse(output);

  assert.equal(state.courses.notebooklm.meta_today.landing_views, 48);
  assert.equal(state.courses.notebooklm.meta_today.candidate_landing_views, 16);
  assert.equal(state.courses.roblox.meta_today.landing_views, 49);
});

test("latest paid CTA funnel replaces the earlier checkpoint", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/update-current-state.mjs", "--dry-run"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );
  const state = JSON.parse(output);

  assert.equal(state.ga4_paid_cta_funnel.observed_at, "2026-07-28T23:28:42+09:00");
  assert.deepEqual(state.ga4_paid_cta_funnel.notebooklm, {
    apply_cta_views: 76,
    apply_clicks: 2,
    view_to_click_percent: 2.63,
    qualified_non_us_course_tagged_clicks: 1,
  });
  assert.deepEqual(state.ga4_paid_cta_funnel.roblox, {
    apply_cta_views: 91,
    apply_clicks: 3,
    view_to_click_percent: 3.3,
    qualified_non_us_course_tagged_clicks: 1,
  });
});

test("confirmation message counts remain unknown until the operator records them", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/update-current-state.mjs", "--dry-run"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );
  const state = JSON.parse(output);

  assert.deepEqual(state.applications.confirmation_messages_sent_by_course, {
    notebooklm: null,
    roblox: null,
  });
  assert.equal(state.applications.confirmation_messages_complete, false);
  assert.equal(state.courses.notebooklm.confirmation_messages_remaining, null);
  assert.equal(state.courses.roblox.confirmation_messages_remaining, null);
});
