#!/usr/bin/env node

import { appendFile, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SNAPSHOT_PATH = resolve(ROOT, "marketing/snapshots.jsonl");
const REPORT_SCRIPT = resolve(ROOT, "scripts/analyze-marketing-funnel.mjs");
const STATE_SCRIPT = resolve(ROOT, "scripts/update-current-state.mjs");

const COURSE_CONTENT = {
  notebooklm: "notebooklm_workload_candidate_v2",
  roblox: "roblox_enterprise_emergency",
};

const assertObject = (value, path) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
};

const assertAllowedKeys = (value, allowed, path) => {
  assertObject(value, path);
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      throw new Error(`Unexpected field ${path}.${key}`);
    }
  }
};

const nonNegativeInteger = (value, path) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${path} must be a non-negative integer`);
  }
  return value;
};

const isoTimestamp = (value, path) => {
  if (typeof value !== "string" || !value.includes("T") || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${path} must be an ISO timestamp`);
  }
  return value;
};

const dateString = (value, path) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${path} must use YYYY-MM-DD`);
  }
  return value;
};

const metricFields = [
  "spend_krw",
  "impressions",
  "link_clicks",
  "landing_views",
  "messaging_conversation_starts",
  "comments",
];

const readMetaMetrics = (value, path) => {
  assertAllowedKeys(value, metricFields, path);
  const metrics = {};
  for (const field of metricFields) {
    metrics[field] = nonNegativeInteger(value[field] ?? 0, `${path}.${field}`);
  }
  return metrics;
};

const readGa4Course = (value, path) => {
  assertAllowedKeys(
    value,
    ["apply_cta_views", "apply_clicks", "qualified_apply_clicks"],
    path,
  );
  return {
    apply_cta_views: nonNegativeInteger(
      value.apply_cta_views,
      `${path}.apply_cta_views`,
    ),
    apply_clicks: nonNegativeInteger(value.apply_clicks, `${path}.apply_clicks`),
    qualified_apply_clicks: nonNegativeInteger(
      value.qualified_apply_clicks,
      `${path}.qualified_apply_clicks`,
    ),
  };
};

const lessThanOrEqual = (left, right, message) => {
  if (left > right) throw new Error(message);
};

const costPerLandingView = (metrics) =>
  metrics.landing_views > 0
    ? Math.round(metrics.spend_krw / metrics.landing_views)
    : null;

const baseRecord = (input, content, sourceSystems) => ({
  recorded_at: input.recorded_at,
  period_start: input.meta_period.start,
  period_end: input.meta_period.end,
  channel: "facebook",
  medium: "paid_social",
  campaign: "dalnayou_2026_08",
  content,
  spend_is_estimate: false,
  source_systems: sourceSystems,
});

export function buildCheckpointRecords(rawInput) {
  assertAllowedKeys(
    rawInput,
    [
      "recorded_at",
      "next_decision_at",
      "meta_period",
      "ga4_period",
      "meta",
      "ga4",
      "forms",
      "payments",
    ],
    "checkpoint",
  );

  const input = structuredClone(rawInput);
  input.recorded_at = isoTimestamp(input.recorded_at, "checkpoint.recorded_at");
  if (input.next_decision_at !== undefined) {
    input.next_decision_at = isoTimestamp(
      input.next_decision_at,
      "checkpoint.next_decision_at",
    );
  }

  assertAllowedKeys(input.meta_period, ["start", "end"], "checkpoint.meta_period");
  input.meta_period.start = dateString(
    input.meta_period.start,
    "checkpoint.meta_period.start",
  );
  input.meta_period.end = dateString(
    input.meta_period.end,
    "checkpoint.meta_period.end",
  );

  assertAllowedKeys(
    input.ga4_period,
    ["start", "end", "end_is_partial"],
    "checkpoint.ga4_period",
  );
  input.ga4_period.start = dateString(
    input.ga4_period.start,
    "checkpoint.ga4_period.start",
  );
  input.ga4_period.end = dateString(
    input.ga4_period.end,
    "checkpoint.ga4_period.end",
  );
  if (typeof input.ga4_period.end_is_partial !== "boolean") {
    throw new Error("checkpoint.ga4_period.end_is_partial must be a boolean");
  }

  assertAllowedKeys(
    input.meta,
    [
      "account_spend_krw",
      "notebooklm_total",
      "notebooklm_active",
      "roblox_active",
    ],
    "checkpoint.meta",
  );
  const accountSpend = nonNegativeInteger(
    input.meta.account_spend_krw,
    "checkpoint.meta.account_spend_krw",
  );
  const notebookTotal = readMetaMetrics(
    input.meta.notebooklm_total,
    "checkpoint.meta.notebooklm_total",
  );
  const notebookActive = readMetaMetrics(
    input.meta.notebooklm_active,
    "checkpoint.meta.notebooklm_active",
  );
  const robloxActive = readMetaMetrics(
    input.meta.roblox_active,
    "checkpoint.meta.roblox_active",
  );

  if (accountSpend !== notebookTotal.spend_krw + robloxActive.spend_krw) {
    throw new Error(
      "checkpoint.meta.account_spend_krw must equal Notebook total plus Roblox active spend",
    );
  }
  for (const field of metricFields) {
    lessThanOrEqual(
      notebookActive[field],
      notebookTotal[field],
      `checkpoint.meta.notebooklm_active.${field} cannot exceed Notebook total`,
    );
  }

  assertAllowedKeys(
    input.ga4,
    [
      "paid_apply_cta_views",
      "paid_apply_clicks",
      "total_apply_clicks",
      "application_submits",
      "us_segment_apply_clicks",
      "notebooklm",
      "roblox",
    ],
    "checkpoint.ga4",
  );
  const notebookGa4 = readGa4Course(
    input.ga4.notebooklm,
    "checkpoint.ga4.notebooklm",
  );
  const robloxGa4 = readGa4Course(
    input.ga4.roblox,
    "checkpoint.ga4.roblox",
  );
  const paidCtaViews = nonNegativeInteger(
    input.ga4.paid_apply_cta_views,
    "checkpoint.ga4.paid_apply_cta_views",
  );
  const paidApplyClicks = nonNegativeInteger(
    input.ga4.paid_apply_clicks,
    "checkpoint.ga4.paid_apply_clicks",
  );
  const totalApplyClicks = nonNegativeInteger(
    input.ga4.total_apply_clicks,
    "checkpoint.ga4.total_apply_clicks",
  );
  const applicationSubmits = nonNegativeInteger(
    input.ga4.application_submits,
    "checkpoint.ga4.application_submits",
  );
  const usApplyClicks = nonNegativeInteger(
    input.ga4.us_segment_apply_clicks,
    "checkpoint.ga4.us_segment_apply_clicks",
  );

  if (paidCtaViews !== notebookGa4.apply_cta_views + robloxGa4.apply_cta_views) {
    throw new Error("GA4 paid CTA views must equal the two course totals");
  }
  if (paidApplyClicks !== notebookGa4.apply_clicks + robloxGa4.apply_clicks) {
    throw new Error("GA4 paid apply clicks must equal the two course totals");
  }
  lessThanOrEqual(
    paidApplyClicks,
    totalApplyClicks,
    "GA4 paid apply clicks cannot exceed total apply clicks",
  );
  lessThanOrEqual(
    usApplyClicks,
    totalApplyClicks,
    "GA4 US apply clicks cannot exceed total apply clicks",
  );
  for (const [key, course] of Object.entries({
    notebooklm: notebookGa4,
    roblox: robloxGa4,
  })) {
    lessThanOrEqual(
      course.apply_clicks,
      course.apply_cta_views,
      `checkpoint.ga4.${key}.apply_clicks cannot exceed CTA views`,
    );
    lessThanOrEqual(
      course.qualified_apply_clicks,
      course.apply_clicks,
      `checkpoint.ga4.${key}.qualified_apply_clicks cannot exceed apply clicks`,
    );
  }

  assertAllowedKeys(
    input.forms,
    ["total", "notebooklm", "roblox"],
    "checkpoint.forms",
  );
  const formTotal = nonNegativeInteger(input.forms.total, "checkpoint.forms.total");
  const notebookForms = nonNegativeInteger(
    input.forms.notebooklm,
    "checkpoint.forms.notebooklm",
  );
  const robloxForms = nonNegativeInteger(
    input.forms.roblox,
    "checkpoint.forms.roblox",
  );
  lessThanOrEqual(
    notebookForms,
    formTotal,
    "Notebook form count cannot exceed total responses",
  );
  lessThanOrEqual(
    robloxForms,
    formTotal,
    "Roblox form count cannot exceed total responses",
  );
  lessThanOrEqual(
    applicationSubmits,
    formTotal,
    "GA4 application submits cannot exceed Google Form responses",
  );

  assertAllowedKeys(input.payments, ["total"], "checkpoint.payments");
  const paymentTotal = nonNegativeInteger(
    input.payments.total,
    "checkpoint.payments.total",
  );

  const aggregateMeta = Object.fromEntries(
    metricFields.map((field) => [
      field,
      notebookTotal[field] + robloxActive[field],
    ]),
  );
  const courseBreakdown = {
    notebooklm: {
      ...notebookTotal,
      cost_per_landing_view_krw: costPerLandingView(notebookTotal),
    },
    roblox: {
      ...robloxActive,
      cost_per_landing_view_krw: costPerLandingView(robloxActive),
    },
  };

  const records = [
    {
      ...baseRecord(input, "course_adset_checkpoint", ["meta"]),
      spend_krw: accountSpend,
      impressions: aggregateMeta.impressions,
      link_clicks: aggregateMeta.link_clicks,
      landing_views: aggregateMeta.landing_views,
      course_clicks: null,
      trust_views: null,
      apply_clicks: null,
      application_submits: null,
      payment_confirmed: null,
      messaging_conversation_starts:
        aggregateMeta.messaging_conversation_starts,
      comments: aggregateMeta.comments,
      metric_sources: Object.fromEntries(
        [
          "spend_krw",
          "impressions",
          "link_clicks",
          "landing_views",
          "messaging_conversation_starts",
          "comments",
        ].map((field) => [field, "meta"]),
      ),
      course_breakdown: courseBreakdown,
      notes:
        "Course-level Meta checkpoint. Notebook totals may include its paused predecessor; " +
        "the active candidate is recorded separately. No ad settings were changed.",
    },
  ];

  for (const [key, metrics, ga4Course] of [
    ["notebooklm", notebookActive, notebookGa4],
    ["roblox", robloxActive, robloxGa4],
  ]) {
    records.push({
      ...baseRecord(input, COURSE_CONTENT[key], ["meta", "ga4"]),
      course: key,
      spend_krw: metrics.spend_krw,
      impressions: metrics.impressions,
      link_clicks: metrics.link_clicks,
      landing_views: metrics.landing_views,
      course_clicks: null,
      trust_views: null,
      apply_clicks: ga4Course.qualified_apply_clicks,
      qualified_apply_clicks: ga4Course.qualified_apply_clicks,
      application_submits: applicationSubmits === 0 ? 0 : null,
      payment_confirmed: null,
      messaging_conversation_starts:
        metrics.messaging_conversation_starts,
      comments: metrics.comments,
      source_systems: ["meta", "ga4"],
      metric_sources: {
        spend_krw: "meta",
        impressions: "meta",
        link_clicks: "meta",
        landing_views: "meta",
        messaging_conversation_starts: "meta",
        comments: "meta",
        apply_clicks: "ga4",
        qualified_apply_clicks: "ga4",
        application_submits: "ga4",
      },
      apply_click_qualification:
        `${ga4Course.qualified_apply_clicks} course-tagged click(s) are in ` +
        "GA4 paid traffic and excluded from the US segment.",
      notes:
        `${key} active-ad checkpoint. Meta reports ` +
        `${metrics.messaging_conversation_starts} message start(s) and ` +
        `${metrics.comments} comment(s).`,
    });
  }

  records.push({
    recorded_at: input.recorded_at,
    period_start: input.ga4_period.start,
    period_end: input.ga4_period.end,
    period_end_is_partial: input.ga4_period.end_is_partial,
    channel: "all",
    medium: "mixed_or_unknown",
    campaign: "dalnayou_2026_08",
    content: "qualified_paid_apply_checkpoint",
    spend_krw: null,
    spend_is_estimate: false,
    impressions: null,
    link_clicks: null,
    landing_views: aggregateMeta.landing_views,
    course_clicks: null,
    trust_views: null,
    apply_cta_views: paidCtaViews,
    apply_clicks: totalApplyClicks,
    application_submits: applicationSubmits,
    form_responses: formTotal,
    payment_confirmed: paymentTotal,
    source_systems: ["meta", "ga4", "google_forms", "operator_report"],
    metric_sources: {
      landing_views: "meta",
      apply_cta_views: "ga4",
      apply_clicks: "ga4",
      application_submits: "ga4",
      form_responses: "google_forms",
      payment_confirmed: "operator_report",
    },
    paid_traffic_apply_clicks: paidApplyClicks,
    us_segment_apply_clicks: usApplyClicks,
    qualified_non_us_paid_course_clicks: {
      notebooklm: notebookGa4.qualified_apply_clicks,
      roblox: robloxGa4.qualified_apply_clicks,
    },
    notes:
      `GA4 paid segment: ${paidCtaViews} CTA views and ${paidApplyClicks} form opens. ` +
      `Google Form responses: ${formTotal}; operator-reported aggregate paid: ${paymentTotal}. ` +
      "Applicant PII is intentionally excluded.",
  });

  for (const [key, course] of Object.entries({
    notebooklm: notebookGa4,
    roblox: robloxGa4,
  })) {
    records.push({
      recorded_at: input.recorded_at,
      period_start: input.ga4_period.start,
      period_end: input.ga4_period.end,
      period_end_is_partial: input.ga4_period.end_is_partial,
      channel: "facebook",
      medium: "paid_social",
      campaign: "dalnayou_2026_08",
      content: `paid_cta_funnel_${key}`,
      course: key,
      link_position: "all_course_ctas",
      spend_krw: null,
      spend_is_estimate: false,
      impressions: null,
      link_clicks: null,
      landing_views: null,
      course_clicks: null,
      trust_views: null,
      apply_cta_views: course.apply_cta_views,
      apply_clicks: course.apply_clicks,
      qualified_apply_clicks: course.qualified_apply_clicks,
      application_submits: applicationSubmits,
      payment_confirmed: null,
      source_systems: ["ga4"],
      metric_sources: {
        apply_cta_views: "ga4",
        apply_clicks: "ga4",
        qualified_apply_clicks: "ga4",
        application_submits: "ga4",
      },
      notes:
        `${key} paid-traffic CTA funnel. Apply clicks are form opens, ` +
        "not completed applications.",
    });
  }

  records.push({
    recorded_at: input.recorded_at,
    period_start: "unknown",
    period_end: input.recorded_at.slice(0, 10),
    channel: "all",
    medium: "mixed_or_unknown",
    campaign: "dalnayou_2026_08",
    content: "all_form_responses",
    spend_krw: null,
    spend_is_estimate: false,
    impressions: null,
    link_clicks: null,
    landing_views: null,
    course_clicks: null,
    trust_views: null,
    apply_clicks: null,
    application_submits: formTotal,
    payment_confirmed: paymentTotal,
    source_systems: ["google_forms", "operator_report"],
    course_breakdown: {
      notebooklm: notebookForms,
      roblox: robloxForms,
    },
    notes:
      `Google Form responses: NotebookLM ${notebookForms}, Roblox ${robloxForms}. ` +
      "The operator-reported aggregate paid count has no inferred course split. " +
      "Applicant PII is intentionally excluded.",
  });

  return {
    accountSpend,
    nextDecisionAt: input.next_decision_at,
    records,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  if (args.includes("--help")) {
    process.stdout.write(
      [
        "Usage:",
        "  npm run marketing:checkpoint -- --input /path/to/checkpoint.json",
        "",
        "Options:",
        "  --input <path>  PII-free aggregate checkpoint JSON",
        "  --example       Print a valid empty input example",
        "  --dry-run       Validate and print records without writing",
        "",
      ].join("\n"),
    );
    return;
  }

  if (args.includes("--example")) {
    const now = new Date();
    const offsetMinutes = -now.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const pad = (value) => String(Math.abs(value)).padStart(2, "0");
    const recordedAt =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` +
      `${sign}${pad(Math.trunc(offsetMinutes / 60))}:${pad(offsetMinutes % 60)}`;
    const date = recordedAt.slice(0, 10);
    const emptyMeta = {
      spend_krw: 0,
      impressions: 0,
      link_clicks: 0,
      landing_views: 0,
      messaging_conversation_starts: 0,
      comments: 0,
    };
    process.stdout.write(
      `${JSON.stringify({
        recorded_at: recordedAt,
        meta_period: { start: date, end: date },
        ga4_period: {
          start: date,
          end: date,
          end_is_partial: true,
        },
        meta: {
          account_spend_krw: 0,
          notebooklm_total: emptyMeta,
          notebooklm_active: emptyMeta,
          roblox_active: emptyMeta,
        },
        ga4: {
          paid_apply_cta_views: 0,
          paid_apply_clicks: 0,
          total_apply_clicks: 0,
          application_submits: 0,
          us_segment_apply_clicks: 0,
          notebooklm: {
            apply_cta_views: 0,
            apply_clicks: 0,
            qualified_apply_clicks: 0,
          },
          roblox: {
            apply_cta_views: 0,
            apply_clicks: 0,
            qualified_apply_clicks: 0,
          },
        },
        forms: { total: 0, notebooklm: 0, roblox: 0 },
        payments: { total: 0 },
      }, null, 2)}\n`,
    );
    return;
  }

  const inputIndex = args.indexOf("--input");
  if (inputIndex < 0 || !args[inputIndex + 1]) {
    throw new Error("--input is required. Run with --help for usage.");
  }
  const allowedArgs = new Set(["--input", "--example", "--dry-run"]);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!allowedArgs.has(arg) && args[index - 1] !== "--input") {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  const inputPath = resolve(process.cwd(), args[inputIndex + 1]);
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const checkpoint = buildCheckpointRecords(input);
  const output =
    `${checkpoint.records.map((record) => JSON.stringify(record)).join("\n")}\n`;

  if (dryRun) {
    process.stdout.write(output);
    return;
  }

  await appendFile(SNAPSHOT_PATH, output, "utf8");

  const stateArgs = [
    STATE_SCRIPT,
    "--account-spend",
    String(checkpoint.accountSpend),
  ];
  if (checkpoint.nextDecisionAt) {
    stateArgs.push("--next-decision", checkpoint.nextDecisionAt);
  }
  for (const [script, scriptArgs] of [
    [STATE_SCRIPT, stateArgs.slice(1)],
    [REPORT_SCRIPT, ["--write"]],
  ]) {
    const result = spawnSync(process.execPath, [script, ...scriptArgs], {
      cwd: ROOT,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      process.stderr.write(result.stderr || result.stdout);
      process.exit(result.status ?? 1);
    }
  }

  process.stdout.write(
    `Recorded ${checkpoint.records.length} PII-free checkpoint records.\n`,
  );
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await main();
