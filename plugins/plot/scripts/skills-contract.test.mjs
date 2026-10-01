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

// A backticked token is a tool name when it carries a Plot tool family prefix, or is `execute`.
const TOOL = /^(?:canvas|asset|library|comment|resource|job|screen|video|audio|image|character|voice)_[a-z_]+$|^execute$/;
const NOT_TOOLS = new Set(["asset_ref", "asset_refs", "canvas_commit"]); // argument and result keys that share a tool prefix
const toolNames = (text) => [...new Set([...text.matchAll(/`([^`\n]+)`/g)].map((match) => match[1]).filter((token) => TOOL.test(token) && !NOT_TOOLS.has(token)))];

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
];

test("skills, references and the canvas worker contain no wording the server forbids", () => {
  const files = [...skills, ...agents, ...readdirSync(join(root, "references")).map((name) => `references/${name}`)];
  for (const file of files) {
    const text = read(file);
    for (const [pattern, reason] of FORBIDDEN) {
      const match = pattern.exec(text);
      assert.equal(match, null, `${file}: ${reason} (${match?.[0]})`);
    }
  }
});

test("the canvas worker preloads the canvas skill, keeps its tools inherited and cannot write local files", () => {
  const worker = read("agents/plot-canvas-worker.md");
  const frontmatter = worker.match(/^---\n([\s\S]*?)\n---/)[1];
  assert.match(frontmatter, /^name: plot-canvas-worker$/m);
  assert.match(frontmatter, /^skills:\n\s+- plot-canvas$/m);
  assert.match(frontmatter, /^disallowedTools:.*\bWrite\b.*\bEdit\b/m);
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
