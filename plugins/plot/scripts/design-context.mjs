import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { designContext } from "./design-context-core.mjs";

// Fail open. No transcript, credential, network, model or subprocess access.
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
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const filename = join(directory, `${session}.json`);
  let seen = [];
  try {
    const state = JSON.parse(await readFile(filename, "utf8"));
    if (state.expires > Date.now() && Array.isArray(state.seen)) seen = state.seen.slice(0, 4);
  } catch {}
  const advice = designContext(event, seen);
  if (advice) {
    const pending = `${filename}.${randomUUID()}`;
    await writeFile(pending, JSON.stringify({ seen: [...seen, advice.key], expires: Date.now() + 7 * 86400000 }), { mode: 0o600 });
    await rename(pending, filename);
    process.stdout.write(JSON.stringify(advice.output));
  }
} catch { /* Advisory failure cannot deny, rewrite or retry the user's tool call. */ }
