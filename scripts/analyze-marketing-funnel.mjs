#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SNAPSHOT_PATH = resolve(ROOT, "marketing/snapshots.jsonl");
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
  "apply_clicks",
  "application_submits",
  "payment_confirmed",
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
  "## 최신 스냅샷",
  "",
  "| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
];

for (const record of latestRecords) {
  const ctr = stageRatio(record, "link_clicks", "impressions");
  const clickToLanding = stageRatio(record, "landing_views", "link_clicks");
  lines.push(
    `| ${record.period_start}~${record.period_end} | \`${record.content}\` | ${won(record.spend_krw, record.spend_is_estimate)} | ${count(record.impressions)} | ${count(record.link_clicks)} | ${cohortCompatible(record, "link_clicks", "impressions") ? percent(ctr) : "비교 금지"} | ${count(record.landing_views)} | ${cohortCompatible(record, "landing_views", "link_clicks") ? percent(clickToLanding) : "비교 금지"} | ${count(record.apply_clicks)} | ${count(record.application_submits)} | ${count(record.payment_confirmed)} |`
  );
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

lines.push(
  "## 운영 규칙",
  "",
  "- 새 수치는 기존 줄을 수정하지 않고 JSONL 마지막에 추가합니다.",
  "- Meta 수치와 GA4 수치를 서로 나눠 전환율을 계산하지 않습니다.",
  "- 복수 시스템 기록은 `metric_sources`로 분자와 분모의 출처가 명시된 비율만 계산합니다.",
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
