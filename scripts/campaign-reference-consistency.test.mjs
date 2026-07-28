import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const state = JSON.parse(
  readFileSync("marketing/current-state.json", "utf8"),
);
const trackingLinks = readFileSync("tracking-links.md", "utf8");
const metaPlan = readFileSync("meta-ad-plan.md", "utf8");

for (const [courseKey, course] of Object.entries(state.courses)) {
  test(`${courseKey} live ad and UTM stay synchronized`, () => {
    for (const document of [trackingLinks, metaPlan]) {
      assert.ok(
        document.includes(course.ad),
        `${course.ad} is missing from an operating reference`,
      );
      assert.ok(
        document.includes(`utm_content=${course.utm_content}`),
        `${course.utm_content} is missing from an operating reference`,
      );
    }
  });
}

test("operating references preserve the approved budget and stop rule", () => {
  assert.equal(state.campaign.daily_budget_total_krw, 40000);
  assert.equal(state.campaign.account_spend_limit_krw, 350000);
  assert.equal(
    state.stop_and_change_rules.stop_course_ad_at_paid_confirmations,
    15,
  );
  assert.match(metaPlan, /전체 일 예산 `40,000원`/);
  assert.match(metaPlan, /계정 지출 한도: `350,000원`/);
  assert.match(metaPlan, /정원 15명에 도달한 과정의 광고 세트만 중단/);
});
