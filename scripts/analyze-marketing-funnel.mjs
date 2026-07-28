#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { calculateCampaignRisk } from "./campaign-risk.mjs";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SNAPSHOT_PATH = resolve(ROOT, "marketing/snapshots.jsonl");
const EXPERIMENT_PATH = resolve(ROOT, "marketing/experiments.json");
const CURRENT_STATE_PATH = resolve(ROOT, "marketing/current-state.json");
const REPORT_PATH = resolve(ROOT, "marketing-report.md");
const WRITE_REPORT = process.argv.includes("--write");

const requiredText = [
  "recorded_at",
  "period_start",
  "period_end",
  "channel",
  "medium",
  "campaign",
  "content",
];
const numericFields = [
  "spend_krw",
  "impressions",
  "link_clicks",
  "landing_views",
  "course_clicks",
  "trust_views",
  "apply_cta_views",
  "apply_clicks",
  "qualified_apply_clicks",
  "application_submits",
  "form_responses",
  "payment_confirmed",
  "confirmation_messages_sent",
];

const raw = await readFile(SNAPSHOT_PATH, "utf8");
const records = raw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line, index) => {
    let record;
    try {
      record = JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSON on snapshots line ${index + 1}: ${error.message}`);
    }
    for (const field of requiredText) {
      if (typeof record[field] !== "string" || !record[field].trim()) {
        throw new Error(`Missing ${field} on snapshots line ${index + 1}`);
      }
    }
    for (const field of numericFields) {
      const value = record[field];
      if (value !== null && value !== undefined && (!Number.isFinite(value) || value < 0)) {
        throw new Error(`Invalid ${field} on snapshots line ${index + 1}`);
      }
    }
    if (!Array.isArray(record.source_systems) || record.source_systems.length === 0) {
      throw new Error(`Missing source_systems on snapshots line ${index + 1}`);
    }
    return record;
  });

if (records.length === 0) {
  throw new Error("No marketing snapshots found");
}

const latestBySegment = new Map();
for (const record of records) {
  const key = [record.channel, record.medium, record.campaign, record.content].join("\u0000");
  latestBySegment.set(key, record);
}
const latestRecords = Array.from(latestBySegment.values());
const experimentConfig = JSON.parse(await readFile(EXPERIMENT_PATH, "utf8"));
if (!Array.isArray(experimentConfig.experiments)) {
  throw new Error("marketing/experiments.json must contain an experiments array");
}
const experiments = experimentConfig.experiments;
const currentState = JSON.parse(await readFile(CURRENT_STATE_PATH, "utf8"));
const latestObservedAt = new Date(records.at(-1).recorded_at);
const goalRisk = calculateCampaignRisk(
  currentState,
  experimentConfig,
  Number.isNaN(latestObservedAt.getTime()) ? new Date() : latestObservedAt,
);
const confirmationCounts = Object.values(
  currentState.applications?.confirmation_messages_sent_by_course ?? {},
);
const confirmationCountsKnown =
  confirmationCounts.length > 0 &&
  confirmationCounts.every(Number.isFinite);
const confirmationTotal = confirmationCountsKnown
  ? confirmationCounts.reduce((sum, value) => sum + value, 0)
  : null;

const ratio = (numerator, denominator) =>
  Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0
    ? numerator / denominator
    : null;
const percent = (value) => value === null ? "—" : `${(value * 100).toFixed(1)}%`;
const count = (value) => Number.isFinite(value) ? value.toLocaleString("ko-KR") : "—";
const won = (value, estimated = false) =>
  Number.isFinite(value)
    ? `${estimated ? "약 " : ""}${Math.round(value).toLocaleString("ko-KR")}원`
    : "—";
const progress = (value, target) =>
  Number.isFinite(value) && Number.isFinite(target) && target > 0
    ? `${count(value)} / ${count(target)} (${Math.min(100, value / target * 100).toFixed(1)}%)`
    : "확인 필요";
const metricSource = (record, field) => {
  const explicit = record.metric_sources?.[field];
  if (typeof explicit === "string" && explicit.trim()) {
    return explicit;
  }
  return record.source_systems.length === 1 ? record.source_systems[0] : null;
};
const cohortCompatible = (record, numerator, denominator) => {
  const numeratorSource = metricSource(record, numerator);
  const denominatorSource = metricSource(record, denominator);
  return numeratorSource !== null && numeratorSource === denominatorSource;
};
const stageRatio = (record, numerator, denominator) =>
  cohortCompatible(record, numerator, denominator)
    ? ratio(record[numerator], record[denominator])
    : null;

const assess = (record) => {
  const checks = [
    {
      stage: "광고 클릭",
      numerator: "link_clicks",
      denominator: "impressions",
      ready: record.impressions >= 1000,
      weak: (value) => value < 0.01,
      action: "광고의 첫 문장·대표 이미지·대상 문제를 우선 점검",
      sample: "노출 1,000회",
    },
    {
      stage: "랜딩 완료",
      numerator: "landing_views",
      denominator: "link_clicks",
      ready: record.link_clicks >= 20,
      weak: (value) => value < 0.6,
      action: "페이지 속도, accidental click, 광고-랜딩 메시지 일치를 점검",
      sample: "링크 클릭 20회",
    },
    {
      stage: "신청서 이동",
      numerator: "apply_clicks",
      denominator: "landing_views",
      ready: record.landing_views >= 30,
      weak: (value) => value < 0.05,
      action: "결과물·신뢰·가격 근거·일정 적합성과 CTA 위치를 점검",
      sample: "유료 랜딩 30회",
    },
    {
      stage: "신청서 제출",
      numerator: "application_submits",
      denominator: "apply_clicks",
      ready: record.apply_clicks >= 10,
      weak: (value) => value < 0.5,
      action: "모바일 폼 길이, 필수 문항, 동의 화면과 자동 선택을 점검",
      sample: "신청서 이동 10회",
    },
    {
      stage: "입금 확정",
      numerator: "payment_confirmed",
      denominator: "application_submits",
      ready: record.application_submits >= 3,
      weak: (value) => value < 0.5,
      action: "입금 안내 속도, 신뢰 근거, 환불 정책과 리마인드를 점검",
      sample: "신청서 제출 3회",
    },
  ];

  return checks.map((check) => {
    const compatible = cohortCompatible(record, check.numerator, check.denominator);
    const value = compatible
      ? ratio(record[check.numerator], record[check.denominator])
      : null;
    if (!compatible) {
      return { ...check, value, status: "비교 금지" };
    }
    if (!check.ready || value === null) {
      return { ...check, value, status: "자료 부족" };
    }
    return { ...check, value, status: check.weak(value) ? "개선 필요" : "관찰 양호" };
  });
};

const lines = [
  "# 클씨랩 AI 클래스 퍼널 보고서",
  "",
  `원본: \`marketing/snapshots.jsonl\` · 최신 기록: ${records.at(-1).recorded_at}`,
  "",
  "서로 다른 분석 시스템의 수치는 동일 코호트가 아니므로 서로 나눠 전환율을 만들지 않습니다.",
  "판정 기준은 초기 모집용 운영 휴리스틱이며 보편적인 업계 기준이 아닙니다.",
  "",
  "## 모집 목표 현황",
  "",
  `- 위험도: **${goalRisk.status === "critical" ? "긴급" : goalRisk.status}**`,
  `- 입금: **${count(goalRisk.paid_confirmed_total)} / ${count(goalRisk.target_paid_total)}명** · 추가 필요 **${count(goalRisk.paid_gap_total)}명**`,
  `- 남은 시간: **${count(goalRisk.hours_remaining)}시간** · 목표 달성에 필요한 일평균 입금 **${count(goalRisk.required_paid_per_day)}명**`,
  `- 과정별 입금 집계: **${goalRisk.course_paid_counts_known ? "확인됨" : "확인 필요"}**`,
  `- 확정 메시지 발송: **${confirmationCountsKnown ? `${count(confirmationTotal)}명` : "과정별 확인 필요"}**`,
  `- E-010 변경 후: 검증된 신청 이동 **${count(goalRisk.e010.additional_qualified_apply_clicks)} / ${count(goalRisk.e010.required_additional_qualified_apply_clicks)}회** · 신규 Form 응답 **${count(goalRisk.e010.google_form_response_delta)}건**`,
  "",
  "| 동일 분석 체계 | CTA 노출 | 신청서 열기 | 노출→신청서 열기 |",
  "| --- | ---: | ---: | ---: |",
  `| GA4 유료 유입 | ${count(goalRisk.same_system_ga4_paid_funnel.apply_cta_views)} | ${count(goalRisk.same_system_ga4_paid_funnel.apply_clicks)} | ${Number.isFinite(goalRisk.same_system_ga4_paid_funnel.view_to_click_percent) ? `${goalRisk.same_system_ga4_paid_funnel.view_to_click_percent.toFixed(2)}%` : "—"} |`,
  "",
  "Meta 랜딩 조회와 GA4 신청 클릭을 나눠 전환율을 만들지 않습니다. `apply_click`은 신청 완료가 아니라 신청서 열기입니다.",
  "",
  "## 다음 판단",
  "",
  `다음 확인 시각: **${currentState.next_decision?.at ?? "미정"}**`,
  "",
  ...(currentState.next_decision?.decision_rules ?? []).map(
    (rule) => `- ${rule}`,
  ),
  "",
  "## 최신 스냅샷",
  "",
  "| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 | 확정 발송 |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
];

for (const record of latestRecords) {
  const ctr = stageRatio(record, "link_clicks", "impressions");
  const clickToLanding = stageRatio(record, "landing_views", "link_clicks");
  lines.push(
    `| ${record.period_start}~${record.period_end} | \`${record.content}\` | ${won(record.spend_krw, record.spend_is_estimate)} | ${count(record.impressions)} | ${count(record.link_clicks)} | ${cohortCompatible(record, "link_clicks", "impressions") ? percent(ctr) : "비교 금지"} | ${count(record.landing_views)} | ${cohortCompatible(record, "landing_views", "link_clicks") ? percent(clickToLanding) : "비교 금지"} | ${count(record.apply_clicks)} | ${count(record.application_submits)} | ${count(record.payment_confirmed)} | ${count(record.confirmation_messages_sent)} |`
  );
}

const latestCtaRecords = latestRecords.filter(
  (record) => Number.isFinite(record.apply_cta_views),
);
lines.push("", "## CTA 위치별 성과", "");
if (latestCtaRecords.length === 0) {
  lines.push(
    "아직 수집된 CTA 위치 스냅샷이 없습니다. 배포 후 같은 GA4 기간·과정·유입 안에서 집계합니다.",
    "",
  );
} else {
  lines.push(
    "| 기간 | 과정·위치 | CTA 노출 | 신청 클릭 | 노출→신청 | 출처 |",
    "| --- | --- | ---: | ---: | ---: | --- |",
  );
  for (const record of latestCtaRecords) {
    const ctaToApply = stageRatio(record, "apply_clicks", "apply_cta_views");
    const position = record.link_position || record.content;
    const course = record.course ? `${record.course} · ` : "";
    lines.push(
      `| ${record.period_start}~${record.period_end} | \`${course}${position}\` | ${count(record.apply_cta_views)} | ${count(record.apply_clicks)} | ${cohortCompatible(record, "apply_clicks", "apply_cta_views") ? percent(ctaToApply) : "비교 금지"} | ${record.source_systems.join(" + ")} |`,
    );
  }
  lines.push("");
}

const liveCourseExperiment = experiments.find(
  (experiment) =>
    experiment.status.startsWith("live") &&
    Array.isArray(experiment.course_segments) &&
    experiment.course_segments.length > 0,
);
if (liveCourseExperiment) {
  const spendThreshold = liveCourseExperiment.change_thresholds?.spend_krw;
  const landingThreshold = liveCourseExperiment.change_thresholds?.landing_views;
  const minimumEnrollment = liveCourseExperiment.minimum_enrollment_per_course;
  const advertisingStopPaidAt = Number.isFinite(
    liveCourseExperiment.advertising_stop_paid_at,
  )
    ? liveCourseExperiment.advertising_stop_paid_at
    : liveCourseExperiment.capacity_per_course;
  const capacity = liveCourseExperiment.capacity_per_course;
  lines.push(
    "## 과정별 실행 판단",
    "",
    `실험: \`${liveCourseExperiment.id}\` · ${count(minimumEnrollment)}명은 개강 기준, ${count(advertisingStopPaidAt)}명은 광고 중단 기준, ${count(capacity)}명은 과정 정원입니다.`,
    "",
    "| 과정 | 지출 판단선 | 랜딩 판단선 | 유효 신청 이동 | 입금 / 개강선 | 입금 / 광고중단 | 입금 / 정원 | 현재 조치 |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  );
  for (const segment of liveCourseExperiment.course_segments) {
    const record = latestRecords.find(
      (candidate) => candidate.content === segment.content,
    );
    const paymentRecord = latestRecords.find(
      (candidate) => candidate.content === segment.payment_content,
    );
    const paymentConfirmed = paymentRecord?.payment_confirmed;
    const decisionApplyClicks = Number.isFinite(record?.qualified_apply_clicks)
      ? record.qualified_apply_clicks
      : record?.apply_clicks;
    const spendReady =
      Number.isFinite(record?.spend_krw) &&
      Number.isFinite(spendThreshold) &&
      record.spend_krw >= spendThreshold;
    const landingReady =
      Number.isFinite(record?.landing_views) &&
      Number.isFinite(landingThreshold) &&
      record.landing_views >= landingThreshold;
    const paymentReady =
      Number.isFinite(paymentConfirmed) &&
      Number.isFinite(advertisingStopPaidAt) &&
      paymentConfirmed >= advertisingStopPaidAt;
    let action = "관찰 유지";
    if (paymentReady) {
      action = "해당 과정 광고 중단";
    } else if (spendReady || landingReady) {
      action = decisionApplyClicks === 0
        ? "소재·첫 화면 교체"
        : Number.isFinite(decisionApplyClicks)
          ? "신청 이후 단계 점검"
          : "GA4 신청 이동 확인 후 판정";
    }
    lines.push(
      `| ${segment.name} | ${progress(record?.spend_krw, spendThreshold)} | ` +
      `${progress(record?.landing_views, landingThreshold)} | ${count(decisionApplyClicks)} | ` +
      `${progress(paymentConfirmed, minimumEnrollment)} | ` +
      `${progress(paymentConfirmed, advertisingStopPaidAt)} | ` +
      `${progress(paymentConfirmed, capacity)} | **${action}** |`,
    );
  }
  lines.push("");
}

lines.push(
  "",
  "## 관찰 이력",
  "",
  "| 기록 시각 | 소재 | 지출 | 노출 | 링크 클릭 | 랜딩 | 출처 |",
  "| --- | --- | ---: | ---: | ---: | ---: | --- |",
);
for (const record of records) {
  lines.push(
    `| ${record.recorded_at} | \`${record.content}\` | ${won(record.spend_krw, record.spend_is_estimate)} | ${count(record.impressions)} | ${count(record.link_clicks)} | ${count(record.landing_views)} | ${record.source_systems.join(" + ")} |`
  );
}

lines.push("", "## 최신 병목 판정", "");
for (const record of latestRecords) {
  lines.push(`### ${record.content}`, "");
  if (record.source_systems.includes("google_forms")) {
    lines.push(
      `- 누적 신청서 제출: **${count(record.application_submits)}건**`,
      "- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)",
    );
    if (record.notes) {
      lines.push(`- 기록: ${record.notes}`);
    }
    lines.push("");
    continue;
  }
  const assessments = assess(record);
  for (const item of assessments) {
    const detail = item.status === "자료 부족"
      ? item.sample
      : item.status === "비교 금지"
        ? "서로 다른 집계 시스템 또는 출처 불명"
        : percent(item.value);
    lines.push(`- ${item.stage}: **${item.status}** (${detail})`);
  }
  const firstWeak = assessments.find((item) => item.status === "개선 필요");
  const nextPending = assessments.find((item) => item.status === "자료 부족");
  if (firstWeak) {
    lines.push(`- 현재 첫 개선 후보: ${firstWeak.action}`);
  } else if (nextPending) {
    lines.push(`- 현재 판단: ${nextPending.sample}까지 관찰을 계속합니다.`);
  } else {
    lines.push("- 현재 판단: 다음 퍼널 단계의 절대 전환 수와 입금 확정을 확인합니다.");
  }
  if (record.source_systems.length > 1) {
    lines.push(`- 데이터 한계: ${record.source_systems.join(" + ")} 혼합 집계이므로 동일 사용자 코호트가 아닙니다.`);
  }
  if (record.notes) {
    lines.push(`- 기록: ${record.notes}`);
  }
  lines.push("");
}

lines.push("## 실험 실행 게이트", "");
const latestObservationMs = Date.parse(records.at(-1).recorded_at);
for (const experiment of experiments) {
  lines.push(`### ${experiment.id} · ${experiment.name}`, "");
  lines.push(`- 준비 상태: \`${experiment.status}\``);
  lines.push(`- 단일 변경: ${experiment.change}`);
  if (experiment.preview_file) {
    lines.push(`- 미리보기: \`${experiment.preview_file}\``);
  }
  if (experiment.candidate_assets) {
    const assets = Object.entries(experiment.candidate_assets)
      .map(([name, path]) => `${name}=\`${path}\``)
      .join(", ");
    lines.push(`- 실행 자산: ${assets}`);
  }
  if (experiment.launch_spec) {
    lines.push(`- 실행 광고: \`${experiment.launch_spec.new_ad_name}\``);
    lines.push(`- 실행 목적지: \`${experiment.launch_spec.destination}\``);
  }
  if (experiment.candidate_form_description) {
    lines.push(
      `- 실행 문안: 신청서 설명 ${experiment.candidate_form_description.length}줄 준비`,
    );
  }
  const isInactive =
    experiment.status.startsWith("superseded") ||
    experiment.status.startsWith("paused");
  const isLive = experiment.status.startsWith("live");
  if (isInactive) {
    lines.push("- 현재 판정: **중지**");
  } else if (isLive) {
    lines.push("- 현재 판정: **실행 중**");
  } else if (experiment.depends_on) {
    lines.push(`- 실행 순서: ${experiment.depends_on} 판정 이후에만 검토`);
    lines.push("- 현재 판정: **대기**");
  } else if (experiment.gate) {
    const gateRecord = latestRecords.find(
      (record) => record.content === experiment.gate.content,
    );
    const current = gateRecord?.[experiment.gate.metric];
    const remaining = Number.isFinite(current)
      ? Math.max(0, experiment.gate.minimum - current)
      : null;
    const sampleReady = remaining === 0;
    const timeReady =
      Number.isFinite(latestObservationMs) &&
      latestObservationMs >= Date.parse(experiment.gate.not_before);
    lines.push(
      `- 표본 게이트: ${count(current)} / ${count(experiment.gate.minimum)} ` +
      `(${sampleReady ? "충족" : `${count(remaining)}회 부족`})`,
    );
    lines.push(
      `- 시간 게이트: ${experiment.gate.not_before} ` +
      `(${timeReady ? "충족" : "대기"})`,
    );
    lines.push(`- 현재 판정: **${sampleReady && timeReady ? "실행 검토 가능" : "대기"}**`);
  }
  if (experiment.additional_condition) {
    lines.push(`- 추가 조건: ${experiment.additional_condition}`);
  }
  lines.push(`- 유지 변수: ${experiment.keep_stable.join(", ")}`);
  lines.push("");
}

lines.push(
  "## 운영 규칙",
  "",
  "- 새 수치는 기존 줄을 수정하지 않고 JSONL 마지막에 추가합니다.",
  "- Meta 수치와 GA4 수치를 서로 나눠 전환율을 계산하지 않습니다.",
  "- 복수 시스템 기록은 `metric_sources`로 분자와 분모의 출처가 명시된 비율만 계산합니다.",
  "- 과정 선택 페이지 유입은 `page_view → course_click → apply_click` 경로로 봅니다.",
  "- 강좌 상세 직접 유입은 `course_click`을 요구하지 않고 `course_landing_view → apply_click` 경로로 봅니다.",
  "- 절대 `apply_click`과 `application_submit` 수를 함께 확인해 닫힌 퍼널의 거짓 0을 방지합니다.",
  "- CTA 위치별 성과는 같은 `link_position`의 `apply_cta_view → apply_click`로 비교합니다.",
  "- GA4는 보고서를 확인한 날이 아니라 최신 완전 처리일을 명시합니다.",
  "- 광고·랜딩·신청서 변경 시각과 실험 ID는 `marketing-history.md`에 기록합니다.",
  "- `자료 부족`을 실패로 부르지 않습니다.",
  "- 광고비 증액과 랜딩 구조 변경을 동시에 진행하지 않습니다.",
  "- 최종 성과는 `payment_confirmed`로 판단합니다.",
  ""
);

const report = `${lines.join("\n").trimEnd()}\n`;
if (WRITE_REPORT) {
  await writeFile(REPORT_PATH, report, "utf8");
  process.stdout.write(`Wrote ${REPORT_PATH}\n`);
} else {
  process.stdout.write(report);
}
