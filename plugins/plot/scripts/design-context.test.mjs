import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const run = (input) => spawnSync(process.execPath, [fileURLToPath(new URL("./design-context.mjs", import.meta.url))], { input: typeof input === "string" ? input : JSON.stringify(input), encoding: "utf8" });
const hooks = JSON.parse(readFileSync(fileURLToPath(new URL("../hooks/hooks.json", import.meta.url)), "utf8")).hooks;

test("the compaction reminder names lookup, execute and help, stays short and fires only on compaction", () => {
  const out = run({ hook_event_name: "SessionStart", source: "compact", session_id: "a" });
  assert.equal(out.status, 0);
  const text = JSON.parse(out.stdout).hookSpecificOutput.additionalContext;
  assert.ok(text.length <= 600, `${text.length} characters`);
  for (const word of ["lookup", "execute", "idempotency_key"]) assert.ok(text.includes(word), word);
  for (const source of ["startup", "resume", "clear", undefined]) assert.equal(run({ hook_event_name: "SessionStart", source, session_id: "a" }).stdout, "");
});

test("the hook fails open on malformed input and hooks.json spawns only on compaction", () => {
  for (const input of ["not json", "null", ""]) {
    const out = run(input);
    assert.equal(out.status, 0);
    assert.equal(out.stdout, "");
  }
  assert.deepEqual(Object.keys(hooks), ["SessionStart"]);
  assert.equal(hooks.SessionStart[0].matcher, "compact");
});
