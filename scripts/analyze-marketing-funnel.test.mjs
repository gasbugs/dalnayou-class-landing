import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");

test("report leads with the paid goal, same-system funnel and next decision rules", () => {
  const report = execFileSync(
    process.execPath,
    [resolve(ROOT, "scripts/analyze-marketing-funnel.mjs")],
    { encoding: "utf8" },
  );

  const goalIndex = report.indexOf("## 모집 목표 현황");
  const snapshotIndex = report.indexOf("## 최신 스냅샷");

  assert.ok(goalIndex >= 0);
  assert.ok(snapshotIndex > goalIndex);
  assert.match(report, /입금: \*\*3 \/ 12명\*\*/);
  assert.match(report, /추가 필요 \*\*9명\*\*/);
  assert.match(report, /확정 메시지 발송: \*\*과정별 확인 필요\*\*/);
  assert.match(report, /GA4 유료 유입 \| 167 \| 5 \| 2\.99%/);
  assert.match(report, /E-013은 E-010 판정 표본 충족과 운영자 승인/);
  assert.match(report, /Meta 랜딩 조회와 GA4 신청 클릭을 나눠 전환율을 만들지 않습니다/);
});
