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

const assess = (record) => {
  const checks = [
    {
      stage: "광고 클릭",
      ready: record.impressions >= 1000,
      value: ratio(record.link_clicks, record.impressions),
      weak: (value) => value < 0.01,
      action: "광고의 첫 문장·대표 이미지·대상 문제를 우선 점검",
      sample: "노출 1,000회",
    },
    {
      stage: "랜딩 완료",
      ready: record.link_clicks >= 20,
      value: ratio(record.landing_views, record.link_clicks),
      weak: (value) => value < 0.6,
      action: "페이지 속도, accidental click, 광고-랜딩 메시지 일치를 점검",
      sample: "링크 클릭 20회",
    },
    {
      stage: "신청서 이동",
      ready: record.landing_views >= 30,
      value: ratio(record.apply_clicks, record.landing_views),
      weak: (value) => value < 0.05,
      action: "결과물·신뢰·가격 근거·일정 적합성과 CTA 위치를 점검",
      sample: "유료 랜딩 30회",
    },
    {
      stage: "신청서 제출",
      ready: record.apply_clicks >= 10,
      value: ratio(record.application_submits, record.apply_clicks),
      weak: (value) => value < 0.5,
      action: "모바일 폼 길이, 필수 문항, 동의 화면과 자동 선택을 점검",
      sample: "신청서 이동 10회",
    },
    {
      stage: "입금 확정",
      ready: record.application_submits >= 3,
      value: ratio(record.payment_confirmed, record.application_submits),
      weak: (value) => value < 0.5,
      action: "입금 안내 속도, 신뢰 근거, 환불 정책과 리마인드를 점검",
      sample: "신청서 제출 3회",
    },
  ];

  return checks.map((check) => {
    if (!check.ready || check.value === null) {
      return { ...check, status: "자료 부족" };
    }
    return { ...check, status: check.weak(check.value) ? "개선 필요" : "관찰 양호" };
  });
};

const lines = [
  "# 클씨랩 AI 클래스 퍼널 보고서",
  "",
  `원본: \`marketing/snapshots.jsonl\` · 최신 기록: ${records.at(-1).recorded_at}`,
  "",
  "이 보고서는 서로 다른 분석 시스템을 섞은 경우 방향성 지표로만 사용합니다.",
  "판정 기준은 초기 모집용 운영 휴리스틱이며 보편적인 업계 기준이 아닙니다.",
  "",
  "## 스냅샷",
  "",
  "| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
];

for (const record of records) {
  lines.push(
    `| ${record.period_start}~${record.period_end} | \`${record.content}\` | ${won(record.spend_krw, record.spend_is_estimate)} | ${count(record.impressions)} | ${count(record.link_clicks)} | ${percent(ratio(record.link_clicks, record.impressions))} | ${count(record.landing_views)} | ${percent(ratio(record.landing_views, record.link_clicks))} | ${count(record.apply_clicks)} | ${count(record.application_submits)} | ${count(record.payment_confirmed)} |`
  );
}

lines.push("", "## 병목 판정", "");
for (const record of records) {
  lines.push(`### ${record.content}`, "");
  const assessments = assess(record);
  for (const item of assessments) {
    const detail = item.status === "자료 부족" ? item.sample : percent(item.value);
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
