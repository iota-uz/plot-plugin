import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { designContext, isAdvisedPlotTool } from "./design-context-core.mjs";

// Fail open. No transcript, credential, network, model or subprocess access.
// The per-session state file holds only the advice keys already given; its existence
// also tells the post-compaction reminder that this session has used Plot.
try {
  let raw = "";
  for await (const chunk of process.stdin) {
    raw += chunk;
    if (raw.length > 16 * 1024 * 1024) process.exit(0);
  }
  const event = JSON.parse(raw);
  if (typeof event.session_id !== "string" || !event.session_id) process.exit(0);
  const session = createHash("sha256").update(event.session_id).digest("hex");
  const directory = join(tmpdir(), "plot-advisory-hooks-v1");
  const filename = join(directory, `${session}.json`);
  let seen = [];
  let known = false;
  try {
    const state = JSON.parse(await readFile(filename, "utf8"));
    if (state.expires > Date.now() && Array.isArray(state.seen)) { seen = state.seen.slice(0, 4); known = true; }
  } catch {}
  if (event.hook_event_name === "SessionStart") {
    // Only a session that has already used Plot gets the compaction reminder.
    const advice = known ? designContext(event) : null;
    if (advice) process.stdout.write(JSON.stringify(advice.output));
  } else if (isAdvisedPlotTool(event)) {
    const advice = designContext(event, seen);
    if (advice || !known) {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const pending = `${filename}.${randomUUID()}`;
      await writeFile(pending, JSON.stringify({ seen: advice ? [...seen, advice.key] : seen, expires: Date.now() + 7 * 86400000 }), { mode: 0o600 });
      await rename(pending, filename);
    }
    if (advice) process.stdout.write(JSON.stringify(advice.output));
  }
} catch { /* Advisory failure cannot deny, rewrite or retry the user's tool call. */ }
