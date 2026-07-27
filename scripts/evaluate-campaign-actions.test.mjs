import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const BASE_STATE = JSON.parse(
  readFileSync(resolve(ROOT, "marketing/current-state.json"), "utf8"),
);
const DECISION_SCRIPT = resolve(ROOT, "scripts/evaluate-campaign-actions.mjs");
const DECISION_TIME = "2026-07-27T20:00:00+09:00";

const evaluate = (mutate) => {
  const state = structuredClone(BASE_STATE);
  mutate(state);
  const directory = mkdtempSync(resolve(tmpdir(), "dalnayou-decision-test-"));
  const statePath = resolve(directory, "state.json");
  writeFileSync(statePath, JSON.stringify(state), "utf8");
  return JSON.parse(
    execFileSync(
      process.execPath,
      [DECISION_SCRIPT, "--now", DECISION_TIME, "--state", statePath],
      { encoding: "utf8" },
    ),
  ).decisions;
};

const actionFor = (decisions, scope, action) =>
  decisions.some(
    (decision) => decision.scope === scope && decision.action === action,
  );

test("six paid learners keeps ads while 15 stops the full course", () => {
  const decisions = evaluate((state) => {
    state.courses.notebooklm.paid_confirmed = 15;
    state.courses.notebooklm.meta_today.landing_views = 30;
    state.courses.roblox.paid_confirmed = 6;
  });

  assert.ok(actionFor(decisions, "notebooklm", "stop_ad"));
  assert.ok(actionFor(decisions, "notebooklm", "skip_e011_course_full"));
  assert.ok(actionFor(decisions, "roblox", "keep_ad"));
});

test("form optimization takes priority over a simultaneous creative change", () => {
  const decisions = evaluate((state) => {
    state.courses.notebooklm.paid_confirmed = 6;
    state.courses.notebooklm.meta_today.landing_views = 30;
    state.courses.notebooklm.processed_apply_clicks = 1;
    state.courses.notebooklm.qualified_apply_clicks = 0;
    state.ga4_today_processed.apply_clicks = 10;
    state.ga4_today_processed.application_submits = 0;
    state.applications.google_form_total = 3;
  });

  assert.ok(actionFor(decisions, "google_form", "apply_e010_description"));
  assert.ok(actionFor(decisions, "notebooklm", "hold_e011_during_form_test"));
});

test("Gemini replacement launches when only its gate is ready", () => {
  const decisions = evaluate((state) => {
    state.courses.notebooklm.paid_confirmed = 6;
    state.courses.notebooklm.meta_today.landing_views = 30;
    state.courses.notebooklm.processed_apply_clicks = 4;
    state.courses.notebooklm.qualified_apply_clicks = 0;
    state.ga4_today_processed.apply_clicks = 0;
    state.ga4_today_processed.application_submits = 0;
  });

  assert.ok(actionFor(decisions, "google_form", "keep_form"));
  assert.ok(
    actionFor(decisions, "notebooklm", "launch_e011_then_pause_v1"),
  );
});

test("qualified local apply evidence holds the Gemini replacement", () => {
  const decisions = evaluate((state) => {
    state.courses.notebooklm.paid_confirmed = 6;
    state.courses.notebooklm.meta_today.landing_views = 30;
    state.courses.notebooklm.processed_apply_clicks = 4;
    state.courses.notebooklm.qualified_apply_clicks = 1;
    state.ga4_today_processed.apply_clicks = 0;
    state.ga4_today_processed.application_submits = 0;
  });

  assert.ok(actionFor(decisions, "google_form", "keep_form"));
  assert.ok(actionFor(decisions, "notebooklm", "keep_current_creative"));
});
