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
const BASE_EXPERIMENTS = JSON.parse(
  readFileSync(resolve(ROOT, "marketing/experiments.json"), "utf8"),
);
const DECISION_SCRIPT = resolve(ROOT, "scripts/evaluate-campaign-actions.mjs");
const DECISION_TIME = "2026-07-27T20:00:00+09:00";

const evaluate = (
  mutate,
  now = DECISION_TIME,
  mutateExperiments = () => {},
) => {
  const state = structuredClone(BASE_STATE);
  const experiments = structuredClone(BASE_EXPERIMENTS);
  mutate(state);
  mutateExperiments(experiments);
  const directory = mkdtempSync(resolve(tmpdir(), "dalnayou-decision-test-"));
  const statePath = resolve(directory, "state.json");
  const experimentPath = resolve(directory, "experiments.json");
  writeFileSync(statePath, JSON.stringify(state), "utf8");
  writeFileSync(experimentPath, JSON.stringify(experiments), "utf8");
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        DECISION_SCRIPT,
        "--now",
        now,
        "--state",
        statePath,
        "--experiments",
        experimentPath,
      ],
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

test("published Gemini candidate is monitored instead of relaunched", () => {
  const decisions = evaluate((state) => {
    state.courses.notebooklm.paid_confirmed = 6;
    state.courses.notebooklm.meta_today.landing_views = 30;
    state.courses.notebooklm.qualified_apply_clicks = 0;
  });

  assert.ok(
    actionFor(decisions, "notebooklm", "monitor_e011_published_candidate"),
  );
  assert.ok(
    !actionFor(decisions, "notebooklm", "launch_e011_then_pause_v1"),
  );
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
  }, DECISION_TIME, (experiments) => {
    experiments.experiments.find((item) => item.id === "E-011").status =
      "prepared";
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
    state.courses.notebooklm.pending_qualification_apply_clicks = 0;
    state.ga4_today_processed.apply_clicks = 0;
    state.ga4_today_processed.application_submits = 0;
  }, DECISION_TIME, (experiments) => {
    experiments.experiments.find((item) => item.id === "E-011").status =
      "prepared";
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
  }, DECISION_TIME, (experiments) => {
    experiments.experiments.find((item) => item.id === "E-011").status =
      "prepared";
  });

  assert.ok(actionFor(decisions, "google_form", "keep_form"));
  assert.ok(actionFor(decisions, "notebooklm", "keep_current_creative"));
});

test("Roblox replacement waits until its scheduled checkpoint", () => {
  const decisions = evaluate((state) => {
    state.courses.roblox.paid_confirmed = 6;
    state.courses.roblox.meta_today.landing_views = 55;
    state.courses.roblox.qualified_apply_clicks = 0;
    state.courses.roblox.pending_qualification_apply_clicks = 0;
  });

  assert.ok(actionFor(decisions, "roblox", "keep_current_creative"));
  assert.ok(!actionFor(decisions, "roblox", "launch_e012_then_pause_v1"));
});

test("Roblox replacement launches after its gate with stagnant qualified clicks", () => {
  const decisions = evaluate((state) => {
    state.courses.roblox.paid_confirmed = 6;
    state.courses.roblox.meta_today.landing_views = 55;
    state.courses.roblox.qualified_apply_clicks = 0;
    state.courses.roblox.pending_qualification_apply_clicks = 0;
    state.ga4_today_processed.apply_clicks = 0;
    state.ga4_today_processed.application_submits = 0;
  }, "2026-07-28T09:00:00+09:00");

  assert.ok(actionFor(decisions, "google_form", "keep_form"));
  assert.ok(actionFor(decisions, "roblox", "launch_e012_then_pause_v1"));
});

test("qualified local Roblox apply evidence holds the replacement", () => {
  const decisions = evaluate((state) => {
    state.courses.roblox.paid_confirmed = 6;
    state.courses.roblox.meta_today.landing_views = 55;
    state.courses.roblox.qualified_apply_clicks = 1;
    state.ga4_today_processed.apply_clicks = 0;
    state.ga4_today_processed.application_submits = 0;
  }, "2026-07-28T09:00:00+09:00");

  assert.ok(actionFor(decisions, "roblox", "keep_current_creative"));
});

test("unresolved Roblox apply attribution holds the replacement", () => {
  const decisions = evaluate((state) => {
    state.courses.roblox.paid_confirmed = 6;
    state.courses.roblox.meta_today.landing_views = 31;
    state.courses.roblox.qualified_apply_clicks = 0;
    state.courses.roblox.pending_qualification_apply_clicks = 1;
    state.ga4_today_processed.apply_clicks = 6;
    state.ga4_today_processed.application_submits = 0;
  }, "2026-07-28T08:40:00+09:00", (experiments) => {
    experiments.experiments.find((item) => item.id === "E-012").gate.not_before =
      "2026-07-28T08:40:00+09:00";
  });

  assert.ok(actionFor(decisions, "roblox", "keep_current_creative"));
  assert.ok(!actionFor(decisions, "roblox", "launch_e012_then_pause_v1"));
});

test("Roblox capacity stop takes priority over E-012", () => {
  const decisions = evaluate((state) => {
    state.courses.roblox.paid_confirmed = 15;
    state.courses.roblox.meta_today.landing_views = 55;
    state.courses.roblox.qualified_apply_clicks = 0;
  }, "2026-07-28T09:00:00+09:00");

  assert.ok(actionFor(decisions, "roblox", "stop_ad"));
  assert.ok(actionFor(decisions, "roblox", "skip_e012_course_full"));
  assert.ok(!actionFor(decisions, "roblox", "launch_e012_then_pause_v1"));
});
