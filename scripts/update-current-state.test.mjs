import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("next decision also refreshes completion-audit evidence time", () => {
  const nextDecision = "2026-07-28T14:00:00+09:00";
  const output = execFileSync(
    process.execPath,
    [
      "scripts/update-current-state.mjs",
      "--dry-run",
      "--next-decision",
      nextDecision,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );
  const state = JSON.parse(output);

  assert.equal(state.next_decision.at, nextDecision);
  assert.ok(
    state.completion_audit.next_required_evidence.includes(
      `Meta, GA4 and Google Form counts at the next scheduled review on ${nextDecision}.`,
    ),
  );
});
