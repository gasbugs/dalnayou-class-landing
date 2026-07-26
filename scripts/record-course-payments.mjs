#!/usr/bin/env node

import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SNAPSHOT_PATH = resolve(ROOT, "marketing/snapshots.jsonl");
const EXPERIMENT_PATH = resolve(ROOT, "marketing/experiments.json");
const REPORT_SCRIPT = resolve(ROOT, "scripts/analyze-marketing-funnel.mjs");
const STATE_SCRIPT = resolve(ROOT, "scripts/update-current-state.mjs");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const allowDecrease = args.includes("--allow-decrease");

if (args.includes("--help")) {
  process.stdout.write(
    [
      "Usage:",
      "  npm run marketing:payments -- --notebooklm 2 --roblox 1",
      "",
      "Options:",
      "  --notebooklm <0-15>  Gemini Notebook paid count",
      "  --roblox <0-15>      Roblox AI paid count",
      "  --dry-run            Validate and print without writing",
      "  --allow-decrease      Allow a lower count for refunds or corrections",
      "",
    ].join("\n"),
  );
  process.exit(0);
}

const values = new Map();
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--dry-run" || arg === "--allow-decrease") {
    continue;
  }
  if (!arg.startsWith("--")) {
    throw new Error(`Unexpected argument: ${arg}`);
  }
  const key = arg.slice(2);
  const rawValue = args[index + 1];
  if (rawValue === undefined || rawValue.startsWith("--")) {
    throw new Error(`Missing value for ${arg}`);
  }
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${arg} must be a non-negative integer`);
  }
  values.set(key, value);
  index += 1;
}

if (values.size === 0) {
  throw new Error("Provide at least one course count. Run with --help for usage.");
}

const experimentConfig = JSON.parse(await readFile(EXPERIMENT_PATH, "utf8"));
const experiment = experimentConfig.experiments.find(
  (candidate) =>
    candidate.status.startsWith("live") &&
    Array.isArray(candidate.course_segments),
);
if (!experiment) {
  throw new Error("No live course experiment with course_segments found");
}

const segments = new Map(
  experiment.course_segments.map((segment) => [segment.key, segment]),
);
for (const key of values.keys()) {
  if (!segments.has(key)) {
    throw new Error(`Unknown course option: --${key}`);
  }
}

const capacity = experiment.capacity_per_course;
for (const [key, value] of values) {
  if (Number.isFinite(capacity) && value > capacity) {
    throw new Error(`--${key} cannot exceed course capacity ${capacity}`);
  }
}

const rawSnapshots = await readFile(SNAPSHOT_PATH, "utf8");
const existing = rawSnapshots
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const latestPayments = new Map();
for (const record of existing) {
  if (Number.isFinite(record.payment_confirmed)) {
    latestPayments.set(record.content, record.payment_confirmed);
  }
}

const now = new Date();
const offsetMinutes = -now.getTimezoneOffset();
const sign = offsetMinutes >= 0 ? "+" : "-";
const pad = (value) => String(Math.abs(value)).padStart(2, "0");
const localIso =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
  `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` +
  `${sign}${pad(Math.trunc(offsetMinutes / 60))}:${pad(offsetMinutes % 60)}`;
const localDate = localIso.slice(0, 10);

const records = [];
for (const [key, value] of values) {
  const segment = segments.get(key);
  const previous = latestPayments.get(segment.payment_content);
  if (previous === value) {
    process.stdout.write(`${segment.name}: unchanged at ${value}; skipped\n`);
    continue;
  }
  if (Number.isFinite(previous) && value < previous && !allowDecrease) {
    throw new Error(
      `${segment.name} would decrease from ${previous} to ${value}; ` +
      "use --allow-decrease for a refund or correction",
    );
  }
  records.push({
    recorded_at: localIso,
    period_start: "unknown",
    period_end: localDate,
    channel: "all",
    medium: "operator_report",
    campaign: "dalnayou_2026_08",
    content: segment.payment_content,
    spend_krw: null,
    spend_is_estimate: false,
    impressions: null,
    link_clicks: null,
    landing_views: null,
    course_clicks: null,
    trust_views: null,
    apply_clicks: null,
    application_submits: null,
    payment_confirmed: value,
    source_systems: ["operator_report"],
    notes:
      `Operator-reported aggregate paid count for ${segment.name}. ` +
      "Applicant PII is intentionally excluded.",
  });
}

if (records.length === 0) {
  process.exit(0);
}

if (dryRun) {
  process.stdout.write(`${records.map((record) => JSON.stringify(record)).join("\n")}\n`);
  process.exit(0);
}

await appendFile(
  SNAPSHOT_PATH,
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);

const report = spawnSync(process.execPath, [REPORT_SCRIPT, "--write"], {
  cwd: ROOT,
  encoding: "utf8",
});
if (report.status !== 0) {
  process.stderr.write(report.stderr || report.stdout);
  process.exit(report.status ?? 1);
}

const state = spawnSync(process.execPath, [STATE_SCRIPT], {
  cwd: ROOT,
  encoding: "utf8",
});
if (state.status !== 0) {
  process.stderr.write(state.stderr || state.stdout);
  process.exit(state.status ?? 1);
}
process.stdout.write(
  `${records.map((record) => `${record.content}: ${record.payment_confirmed}`).join("\n")}\n`,
);
