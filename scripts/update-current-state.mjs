#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const STATE_PATH = resolve(ROOT, "marketing/current-state.json");
const SNAPSHOT_PATH = resolve(ROOT, "marketing/snapshots.jsonl");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const option = (name) => {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`Missing value for ${name}`);
  }
  return value;
};
const integerOption = (name) => {
  const raw = option(name);
  if (raw === undefined) return undefined;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
};

if (args.includes("--help")) {
  process.stdout.write(
    [
      "Usage:",
      "  npm run marketing:state",
      "  npm run marketing:state -- --account-spend 31928 --account-limit 310000",
      "",
      "Options:",
      "  --account-spend <KRW>      Latest account spend",
      "  --account-limit <KRW>      Current account spending limit",
      "  --account-remaining <KRW>  Remaining account spending limit",
      "  --next-decision <ISO>      Next review time",
      "  --dry-run                  Print without writing",
    ].join("\n"),
  );
  process.exit(0);
}

const state = JSON.parse(await readFile(STATE_PATH, "utf8"));
const experimentConfig = JSON.parse(
  await readFile(resolve(ROOT, "marketing/experiments.json"), "utf8"),
);
const liveExperiment = experimentConfig.experiments.find((candidate) =>
  candidate.status.startsWith("live"),
);
const records = (await readFile(SNAPSHOT_PATH, "utf8"))
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const latestByContent = new Map();
for (const record of records) {
  latestByContent.set(record.content, record);
}

const newestTimestamp = records
  .map((record) => record.recorded_at)
  .filter(Boolean)
  .sort()
  .at(-1);
if (newestTimestamp) state.updated_at = newestTimestamp;

const paidByCourse = {};
for (const [key, course] of Object.entries(state.courses)) {
  const metaRecord = latestByContent.get(course.utm_content);
  if (metaRecord) {
    const ctr =
      Number.isFinite(metaRecord.link_clicks) &&
      Number.isFinite(metaRecord.impressions) &&
      metaRecord.impressions > 0
        ? (metaRecord.link_clicks / metaRecord.impressions) * 100
        : null;
    const landingCost =
      Number.isFinite(metaRecord.spend_krw) &&
      Number.isFinite(metaRecord.landing_views) &&
      metaRecord.landing_views > 0
        ? metaRecord.spend_krw / metaRecord.landing_views
        : null;
    course.meta_today = {
      spend_krw: metaRecord.spend_krw,
      impressions: metaRecord.impressions,
      link_clicks: metaRecord.link_clicks,
      landing_views: metaRecord.landing_views,
      link_ctr_percent: Number.isFinite(ctr) ? Number(ctr.toFixed(2)) : null,
      cost_per_landing_view_krw: Number.isFinite(landingCost)
        ? Math.round(landingCost)
        : null,
    };
  }

  const segment = liveExperiment?.course_segments?.find(
    (candidate) => candidate.key === key,
  );
  const paymentRecord = segment
    ? latestByContent.get(segment.payment_content)
    : undefined;
  if (Number.isFinite(paymentRecord?.payment_confirmed)) {
    course.paid_confirmed = paymentRecord.payment_confirmed;
    course.remaining_to_target = Math.max(
      0,
      course.paid_target - course.paid_confirmed,
    );
    paidByCourse[key] = course.paid_confirmed;
  }
}

const formRecord = latestByContent.get("all_form_responses");
if (formRecord) {
  state.applications.google_form_total = formRecord.application_submits;
  if (Number.isFinite(formRecord.payment_confirmed)) {
    state.applications.paid_confirmed_total_reported_by_user =
      formRecord.payment_confirmed;
  }
}

if (Object.keys(paidByCourse).length > 0) {
  state.applications.paid_confirmed_by_course = Object.fromEntries(
    Object.keys(state.courses).map((key) => [
      key,
      Number.isFinite(paidByCourse[key]) ? paidByCourse[key] : null,
    ]),
  );
  const allCourseCountsKnown = Object.keys(state.courses).every((key) =>
    Number.isFinite(paidByCourse[key]),
  );
  if (allCourseCountsKnown) {
    state.applications.paid_confirmed_total_reported_by_user = Object.values(
      paidByCourse,
    ).reduce((total, value) => total + value, 0);
    state.applications.note =
      "Course-level paid counts are operator-reported aggregates. Applicant PII is not stored.";
  } else {
    state.applications.note =
      "Only some course-level paid counts are known. Do not infer the missing course count.";
  }
}

const accountSpend = integerOption("--account-spend");
const accountLimit = integerOption("--account-limit");
const accountRemaining = integerOption("--account-remaining");
if (accountSpend !== undefined) {
  state.campaign.account_spend_to_date_krw = accountSpend;
}
if (accountLimit !== undefined) {
  state.campaign.account_spend_limit_krw = accountLimit;
}
if (accountRemaining !== undefined) {
  state.campaign.account_spend_remaining_krw = accountRemaining;
} else if (accountSpend !== undefined || accountLimit !== undefined) {
  state.campaign.account_spend_remaining_krw = Math.max(
    0,
    state.campaign.account_spend_limit_krw -
      state.campaign.account_spend_to_date_krw,
  );
}

const nextDecision = option("--next-decision");
if (nextDecision !== undefined) {
  state.next_decision.at = nextDecision;
}

const output = `${JSON.stringify(state, null, 2)}\n`;
if (dryRun) {
  process.stdout.write(output);
} else {
  await writeFile(STATE_PATH, output, "utf8");
  process.stdout.write(`Updated ${STATE_PATH}\n`);
}
