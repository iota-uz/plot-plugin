import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const contract = JSON.parse(read("contract.json"));
const agents = readdirSync(join(root, "agents")).map((name) => `agents/${name}`);
const skills = contract.skills.map((name) => `skills/${name}/SKILL.md`);

// A backticked token is a tool name when it carries a Plot tool family prefix, or is `execute`; a call such as
// `canvas_snapshot({ref, targets})` names its tool before the parenthesis.
const TOOL = /^(?:canvas|asset|library|comment|resource|job|screen|video|audio|image|character|voice)_[a-z_]+$|^execute$/;
const NOT_TOOLS = new Set(["asset_ref", "asset_refs", "canvas_commit", "job_id"]); // argument and result keys that share a tool prefix
const toolNames = (text) => [...new Set([...text.matchAll(/`([a-z_]+)(?:\([^`\n]*)?`/g)].map((match) => match[1]).filter((token) => TOOL.test(token) && !NOT_TOOLS.has(token)))];
const references = readdirSync(join(root, "references")).map((name) => `references/${name}`);

test("every tool the skills and the canvas worker name is in contract.json requiredTools", () => {
  for (const file of [...skills, ...agents]) {
    const names = toolNames(read(file));
    assert.ok(names.length > 0, `${file} names no tools`);
    assert.deepEqual(names.filter((name) => !contract.requiredTools.includes(name)), [], file);
  }
  assert.equal(new Set(contract.requiredTools).size, contract.requiredTools.length);
});

test("requiredTools lists only tools some skill or agent names", () => {
  const named = new Set([...skills, ...agents].flatMap((file) => toolNames(read(file))));
  assert.deepEqual(contract.requiredTools.filter((name) => !named.has(name)), []);
});

// Wording the server contract has retired or forbids.
const FORBIDDEN = [
  [/scratchpad/i, "local scratchpad drafting"],
  [/drafting/i, "local drafting"],
  [/Keep HTML maintainable/i, "HTML-first authoring"],
  [/Inline HTML/i, "HTML-first authoring"],
  [/recommendations/i, "recommendations (replaced by inspect)"],
  [/inspect_changed_canvas/, "recommendation code (replaced by inspect)"],
  [/page\.doc\.patch/, "removed page.doc.patch wrapper"],
  [/scope\s*:\s*\{/, "removed execute scope object"],
  [/"?target"?\s*:\s*\{/, "removed top-level snapshot target"],
  [/draft_id|canvas\.preview\(/, "staged previews"],
  [/retry (?:it )?with a new idempotency/i, "the server asks for the same call, not a new key"],
  [/let the server fit heights/i, "nodes.fit is only for ids in fit_pending (new screens fit themselves)"],
  [/canvas_shell[^\n]*\bscript\b|`script`/, "canvas_shell takes command, not script"],
  [/\{\s*old\s*[:,]/, "files.patch takes {old_string, new_string}"],
  [/close each thread/i, "comment_complete records the change; only the reviewer resolves a thread"],
  [/library_(?:get|save)[^\n]*\b(?:paths|edits)\b/, "library_get has no paths and library_save no edits (canvas_file_get / canvas_edit take the library ref)"],
  [/\bscreens\.upsert\b[^\n]*viewport:\s*\{[^}]*height/, "screens.upsert with a viewport height turns auto height off"],
  [/nodes\.delete/, "the operation is nodes.remove (nodes.delete is the canvas_nodes_delete tool's wording)"],
  [/\b(?:replaces?|replacing) (?:every|all|the)\b[^\n]{0,20}\b(?:pages|screens)\b|\bcomplete set\b/i, "screens[] is additive: it never replaces or removes pages"],
  [/(?:canvas_patch|execute)[^\n]*(?:returns? no|without) `?inspect/i, "canvas_patch and execute commits return inspect"],
  [/\bupserted_screens\b/, "inspect, not upserted_screens, names the nodes to snapshot"],
];

test("skills, references and the canvas worker contain no wording the server forbids", () => {
  for (const file of [...skills, ...agents, ...references]) {
    const text = read(file);
    for (const [pattern, reason] of FORBIDDEN) {
      const match = pattern.exec(text);
      assert.equal(match, null, `${file}: ${reason} (${match?.[0]})`);
    }
  }
});

test("every tool the worker rules name is in contract.json requiredTools", () => {
  const names = toolNames(read("references/worker-rules.md"));
  assert.ok(names.length > 0);
  assert.deepEqual(names.filter((name) => !contract.requiredTools.includes(name)), []);
});

test("the worker rules in references/ and in the canvas worker are the same text", () => {
  const bullets = (text) => text.split("\n").filter((line) => line.startsWith("- "));
  const rules = bullets(read("references/worker-rules.md"));
  assert.ok(rules.length >= 8);
  assert.deepEqual(bullets(read("agents/plot-canvas-worker.md")), rules);
});

test("the canvas skill carries the 2026-10-01 contract: auto height, inspect, tiles, digest, attach, conflicts", () => {
  const skill = read("skills/plot-canvas/SKILL.md");
  const rules = read("references/worker-rules.md");
  for (const word of ["fit_pending", "fitted", "inspect", "targets", "tiles", "tile_revision_changed", "captures[].error", "screens.upsert", "nodes.pack", "nodes.remove", "viewport_relative", "fit_blocked_by_boundary", "EXECUTE_NOT_STARTED", "no_change", "ref_taken", "published_version", "sections", "below", "attach", "library_get", "library_publish", "version:\"draft\"", "error.job", "canvas_commit", "comment_complete"]) {
    assert.ok(skill.includes(word), `plot-canvas does not mention ${word}`);
  }
  for (const word of ["file_changed", "revision_conflict", "edit_already_applied", "idempotency_key", "fit_pending", "tiles.next", "screens.upsert", "inspect", "node_id"]) {
    assert.ok(rules.includes(word), `worker rules do not mention ${word}`);
  }
});

test("contract.json names the server contract version that the changelog describes", () => {
  assert.match(contract.contractVersion, /^\d{4}-\d{2}-\d{2}$/);
  const entry = read("../../CHANGELOG.md").split(/^## /m).find((section) => section.startsWith("0.2.0"));
  assert.ok(entry?.includes(contract.contractVersion), "the 0.2.0 changelog entry names the contract version");
  assert.equal(JSON.parse(read(".claude-plugin/plugin.json")).version, "0.2.0");
});

test("the canvas worker preloads the canvas skill, keeps its tools inherited and cannot write local files (no Bash, Write or Edit)", () => {
  const worker = read("agents/plot-canvas-worker.md");
  const frontmatter = worker.match(/^---\n([\s\S]*?)\n---/)[1];
  assert.match(frontmatter, /^name: plot-canvas-worker$/m);
  assert.match(frontmatter, /^skills:\n\s+- plot-canvas$/m);
  assert.match(frontmatter, /^disallowedTools:.*\bBash\b.*\bWrite\b.*\bEdit\b/m);
  // Claude Code ignores these in plugin agents, and a tools allowlist would hide Plot tools whose prefix depends on how the server is installed.
  assert.doesNotMatch(frontmatter, /^(?:tools|hooks|mcpServers|permissionMode):/m);
});

test("the canvas skill stays within its size budget and states the precedence of the server", () => {
  const skill = read("skills/plot-canvas/SKILL.md");
  assert.ok(skill.length <= 8000, `${skill.length} characters`);
  assert.match(skill, /canvas\.iota\.uz/);
  assert.match(skill, /they win/);
  assert.match(skill, /plot:plot-canvas-worker/);
});
