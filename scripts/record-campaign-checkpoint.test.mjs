import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";
import { buildCheckpointRecords } from "./record-campaign-checkpoint.mjs";

const validInput = () => ({
  recorded_at: "2026-07-29T00:02:59+09:00",
  next_decision_at: "2026-07-29T09:00:00+09:00",
  meta_period: {
    start: "2026-07-27",
    end: "2026-07-28",
  },
  ga4_period: {
    start: "2026-07-26",
    end: "2026-07-29",
    end_is_partial: true,
  },
  meta: {
    account_spend_krw: 74793,
    notebooklm_total: {
      spend_krw: 36963,
      impressions: 9796,
      link_clicks: 63,
      landing_views: 49,
      messaging_conversation_starts: 0,
      comments: 0,
    },
    notebooklm_active: {
      spend_krw: 14924,
      impressions: 3986,
      link_clicks: 23,
      landing_views: 17,
      messaging_conversation_starts: 0,
      comments: 0,
    },
    roblox_active: {
      spend_krw: 37830,
      impressions: 11172,
      link_clicks: 58,
      landing_views: 51,
      messaging_conversation_starts: 0,
      comments: 0,
    },
  },
  ga4: {
    paid_apply_cta_views: 183,
    paid_apply_clicks: 5,
    total_apply_clicks: 6,
    application_submits: 0,
    us_segment_apply_clicks: 4,
    notebooklm: {
      apply_cta_views: 82,
      apply_clicks: 2,
      qualified_apply_clicks: 1,
    },
    roblox: {
      apply_cta_views: 101,
      apply_clicks: 3,
      qualified_apply_clicks: 1,
    },
  },
  forms: {
    total: 3,
    notebooklm: 2,
    roblox: 1,
  },
  payments: {
    total: 3,
  },
});

test("builds the seven PII-free daily checkpoint records", () => {
  const checkpoint = buildCheckpointRecords(validInput());

  assert.equal(checkpoint.accountSpend, 74793);
  assert.equal(checkpoint.nextDecisionAt, "2026-07-29T09:00:00+09:00");
  assert.equal(checkpoint.records.length, 7);

  const aggregate = checkpoint.records.find(
    (record) => record.content === "course_adset_checkpoint",
  );
  assert.equal(aggregate.spend_krw, 74793);
  assert.equal(aggregate.landing_views, 100);
  assert.equal(
    aggregate.course_breakdown.notebooklm.cost_per_landing_view_krw,
    754,
  );
  assert.equal(
    aggregate.course_breakdown.roblox.cost_per_landing_view_krw,
    742,
  );

  const ga4 = checkpoint.records.find(
    (record) => record.content === "qualified_paid_apply_checkpoint",
  );
  assert.equal(ga4.period_end_is_partial, true);
  assert.equal(ga4.apply_cta_views, 183);
  assert.equal(ga4.paid_traffic_apply_clicks, 5);
  assert.deepEqual(ga4.qualified_non_us_paid_course_clicks, {
    notebooklm: 1,
    roblox: 1,
  });
});

test("rejects mismatched course funnel totals", () => {
  const input = validInput();
  input.ga4.paid_apply_clicks = 4;

  assert.throws(
    () => buildCheckpointRecords(input),
    /paid apply clicks must equal the two course totals/,
  );
});

test("rejects unexpected fields so applicant PII cannot enter the checkpoint", () => {
  const input = validInput();
  input.phone = "010-0000-0000";

  assert.throws(
    () => buildCheckpointRecords(input),
    /Unexpected field checkpoint\.phone/,
  );
});

test("prints an example that passes the same checkpoint validation", () => {
  const output = execFileSync(
    process.execPath,
    [resolve(import.meta.dirname, "record-campaign-checkpoint.mjs"), "--example"],
    { encoding: "utf8" },
  );

  const checkpoint = buildCheckpointRecords(JSON.parse(output));
  assert.equal(checkpoint.records.length, 7);
});
