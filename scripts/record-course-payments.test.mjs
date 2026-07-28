import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const SCRIPT = resolve(ROOT, "scripts/record-course-payments.mjs");

test("payment recorder emits PII-free payment and confirmation aggregates", () => {
  const output = execFileSync(
    process.execPath,
    [
      SCRIPT,
      "--notebooklm",
      "2",
      "--notebooklm-confirmations",
      "2",
      "--dry-run",
    ],
    { cwd: ROOT, encoding: "utf8" },
  );
  const records = output
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

  assert.equal(records.length, 2);
  assert.equal(records[0].payment_confirmed, 2);
  assert.equal(records[1].confirmation_messages_sent, 2);
  assert.deepEqual(records[1].source_systems, ["operator_report"]);
  assert.match(records[1].notes, /PII is intentionally excluded/);
});

test("confirmation count cannot exceed the paid count", () => {
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          SCRIPT,
          "--roblox",
          "1",
          "--roblox-confirmations",
          "2",
          "--dry-run",
        ],
        { cwd: ROOT, encoding: "utf8", stdio: "pipe" },
      ),
    /cannot exceed the paid count 1/,
  );
});
