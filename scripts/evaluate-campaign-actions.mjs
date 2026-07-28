#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const statePath = resolve(ROOT, option("--state") || "marketing/current-state.json");
const experimentPath = resolve(
  ROOT,
  option("--experiments") || "marketing/experiments.json",
);
const state = JSON.parse(
  await readFile(statePath, "utf8"),
);
const config = JSON.parse(
  await readFile(experimentPath, "utf8"),
);

const now = option("--now") ? new Date(option("--now")) : new Date();
if (Number.isNaN(now.getTime())) {
  throw new Error("--now must be a valid ISO timestamp");
}

const decisions = [];
const push = (scope, action, reason) => decisions.push({ scope, action, reason });

for (const [key, course] of Object.entries(state.courses)) {
  if (
    Number.isFinite(course.paid_confirmed) &&
    Number.isFinite(course.advertising_stop_paid_at) &&
    course.paid_confirmed >= course.advertising_stop_paid_at
  ) {
    push(key, "stop_ad", `입금 ${course.paid_confirmed}명으로 정원 ${course.advertising_stop_paid_at}명 충족`);
  } else if (
    Number.isFinite(course.paid_confirmed) &&
    Number.isFinite(course.minimum_enrollment) &&
    course.paid_confirmed >= course.minimum_enrollment
  ) {
    push(key, "keep_ad", `입금 ${course.paid_confirmed}명으로 개강 기준 충족, 정원 전까지 모집 유지`);
  } else {
    push(key, "keep_ad", "과정별 입금 수가 정원에 도달했다는 증거가 없음");
  }
}

const e010 = config.experiments.find((experiment) => experiment.id === "E-010");
let formChangeScheduled = false;
if (e010) {
  const experimentRunning = e010.status === "running";
  if (experimentRunning) {
    const qualifiedApplyClicks = Object.values(state.courses).reduce(
      (sum, course) =>
        sum +
        (Number.isFinite(course.qualified_apply_clicks)
          ? course.qualified_apply_clicks
          : 0),
      0,
    );
    const qualifiedBaseline =
      e010.post_change_baseline?.qualified_non_us_paid_course_clicks ?? 0;
    const qualifiedDelta = Math.max(
      0,
      qualifiedApplyClicks - qualifiedBaseline,
    );
    const evaluationMinimum =
      e010.evaluation_gate?.minimum_additional_qualified_apply_clicks ?? 10;
    formChangeScheduled = qualifiedDelta < evaluationMinimum;
    push(
      "google_form",
      formChangeScheduled ? "monitor_e010" : "evaluate_e010",
      `E-010 실행 중, 변경 후 검증된 신청 이동 ${qualifiedDelta}/${evaluationMinimum}회`,
    );
  } else if (e010.status === "queued") {
    const timeReady = now >= new Date(e010.gate.not_before);
    const applyClicks = state.ga4_today_processed?.apply_clicks;
    const submits = state.ga4_today_processed?.application_submits;
    const formResponses = state.applications.google_form_total;
    const sampleReady =
      Number.isFinite(applyClicks) && applyClicks >= e010.gate.minimum;
    const noSubmitIncrease =
      submits === 0 &&
      Number.isFinite(formResponses) &&
      formResponses <= e010.baseline.google_form_responses;
    formChangeScheduled = timeReady && sampleReady && noSubmitIncrease;
    push(
      "google_form",
      formChangeScheduled ? "apply_e010_description" : "keep_form",
      `시간 ${timeReady ? "충족" : "대기"}, 신청 이동 ${applyClicks ?? "미확인"}/${e010.gate.minimum}, Form 응답 ${formResponses ?? "미확인"}건`,
    );
  } else {
    push(
      "google_form",
      "keep_form",
      `E-010 상태가 ${e010.status}이므로 설명을 다시 적용하지 않음`,
    );
  }
}

const e011 = config.experiments.find((experiment) => experiment.id === "E-011");
if (e011) {
  const course = state.courses.notebooklm;
  const alreadyPublished = e011.status.startsWith("published_");
  const courseAtCapacity =
    Number.isFinite(course.paid_confirmed) &&
    Number.isFinite(course.advertising_stop_paid_at) &&
    course.paid_confirmed >= course.advertising_stop_paid_at;
  const timeReady = now >= new Date(e011.gate.not_before);
  const sampleReady =
    course.meta_today.spend_krw >=
      state.stop_and_change_rules.change_creative_if_spend_krw_reaches ||
    course.meta_today.landing_views >= e011.gate.minimum;
  const qualifiedApplyClicks = course.qualified_apply_clicks;
  const pendingQualificationApplyClicks =
    course.pending_qualification_apply_clicks;
  const attributionPending =
    Number.isFinite(pendingQualificationApplyClicks) &&
    pendingQualificationApplyClicks > 0;
  const applyStagnant =
    Number.isFinite(qualifiedApplyClicks) &&
    qualifiedApplyClicks <= e011.baseline.qualified_apply_clicks &&
    !attributionPending;
  push(
    "notebooklm",
    courseAtCapacity
      ? "skip_e011_course_full"
      : alreadyPublished
        ? "monitor_e011_published_candidate"
      : formChangeScheduled
        ? "hold_e011_during_form_test"
      : timeReady && sampleReady && applyStagnant
        ? "launch_e011_then_pause_v1"
        : "keep_current_creative",
    courseAtCapacity
      ? "과정 정원 충족으로 광고 중단이 소재 교체보다 우선"
      : alreadyPublished
        ? `E-011 상태가 ${e011.status}이므로 재게시하지 않고 후보 상태와 성과만 확인`
      : formChangeScheduled
        ? "신청 이동 이후 Form 병목 실험을 먼저 실행해 동시 변수 변경을 방지"
      : `시간 ${timeReady ? "충족" : "대기"}, 랜딩 ${course.meta_today.landing_views}/${e011.gate.minimum}, 지출 ${course.meta_today.spend_krw ?? "미확인"}원, 검증된 신청 이동 ${qualifiedApplyClicks ?? "미확인"}회, 출처 확인 대기 ${pendingQualificationApplyClicks ?? 0}회 (원시 ${course.processed_apply_clicks ?? "미확인"}회)`,
  );
}

const e012 = config.experiments.find((experiment) => experiment.id === "E-012");
if (e012) {
  const course = state.courses.roblox;
  const alreadyPublished = e012.status.startsWith("published_");
  const courseAtCapacity =
    Number.isFinite(course.paid_confirmed) &&
    Number.isFinite(course.advertising_stop_paid_at) &&
    course.paid_confirmed >= course.advertising_stop_paid_at;
  const timeReady = now >= new Date(e012.gate.not_before);
  const sampleReady =
    course.meta_today.spend_krw >=
      state.stop_and_change_rules.change_creative_if_spend_krw_reaches ||
    course.meta_today.landing_views >= e012.gate.minimum;
  const qualifiedApplyClicks = course.qualified_apply_clicks;
  const pendingQualificationApplyClicks =
    course.pending_qualification_apply_clicks;
  const attributionPending =
    Number.isFinite(pendingQualificationApplyClicks) &&
    pendingQualificationApplyClicks > 0;
  const applyStagnant =
    Number.isFinite(qualifiedApplyClicks) &&
    qualifiedApplyClicks <= e012.baseline.qualified_apply_clicks &&
    !attributionPending;
  push(
    "roblox",
    courseAtCapacity
      ? "skip_e012_course_full"
      : alreadyPublished
        ? "monitor_e012_published_candidate"
        : formChangeScheduled
          ? "hold_e012_during_form_test"
          : timeReady && sampleReady && applyStagnant
            ? "launch_e012_then_pause_v1"
            : "keep_current_creative",
    courseAtCapacity
      ? "과정 정원 충족으로 광고 중단이 소재 교체보다 우선"
      : alreadyPublished
        ? `E-012 상태가 ${e012.status}이므로 재게시하지 않고 후보 상태와 성과만 확인`
        : formChangeScheduled
          ? "신청 이동 이후 Form 병목 실험을 먼저 실행해 동시 변수 변경을 방지"
          : `시간 ${timeReady ? "충족" : "대기"}, 랜딩 ${course.meta_today.landing_views}/${e012.gate.minimum}, 지출 ${course.meta_today.spend_krw ?? "미확인"}원, 검증된 신청 이동 ${qualifiedApplyClicks ?? "미확인"}회, 출처 확인 대기 ${pendingQualificationApplyClicks ?? 0}회 (원시 ${course.processed_apply_clicks ?? "미확인"}회)`,
  );
}

process.stdout.write(
  `${JSON.stringify(
    {
      evaluated_at: now.toISOString(),
      aggregate_daily_budget_krw: state.campaign.daily_budget_total_krw,
      decisions,
    },
    null,
    2,
  )}\n`,
);
