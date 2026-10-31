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
const references = readdirSync(join(root, "references")).map((name) => `references/${name}`);
const everything = [...skills, ...agents, ...references];

// The server exposes one tool, `execute`. A backticked `plot.<namespace>.<method>` must be an operation of its registry.
const operations = new Set(contract.operations);
const calls = (text) => [...text.matchAll(/`plot\.([a-z]+)\.([A-Za-z]+)[`(({]/g)].map((match) => `${match[1]}.${match[2]}`);

test("contract.json requires exactly the one tool the server exposes", () => {
  assert.deepEqual(contract.requiredTools, ["execute"]);
  assert.equal(new Set(contract.operations).size, contract.operations.length);
});

test("every plot.<namespace>.<method> the skills, references and the worker name is a registry operation", () => {
  for (const file of everything) {
    const unknown = calls(read(file)).filter((name) => !operations.has(name));
    assert.deepEqual(unknown, [], file);
  }
  for (const file of [...skills, ...agents]) assert.ok(read(file).includes("`execute`"), `${file} never names execute`);
});

// Tools and wording the server contract has retired.
const FORBIDDEN = [
  [/`(?:canvas|screen|library|comment|resource|asset|job|video|audio|image|character|voice)_[a-z_]+`/, "removed per-feature tool; use execute and plot.<namespace>.<method>"],
  [/scratchpad|local drafting/i, "local drafting"],
  [/HTML-first|Inline HTML/i, "HTML-first authoring"],
  [/retry (?:it )?with a new idempotency/i, "the server asks for the same call and key"],
];

test("skills, references and the canvas worker contain no retired tool names or wording", () => {
  for (const file of everything) {
    const text = read(file);
    for (const [pattern, reason] of FORBIDDEN) {
      const match = pattern.exec(text);
      assert.equal(match, null, `${file}: ${reason} (${match?.[0]})`);
    }
  }
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

test("the skills stay within their size budget and state the precedence of the server", () => {
  for (const file of skills) assert.ok(read(file).length <= 8000, `${file}: ${read(file).length} characters`);
  const canvas = read("skills/plot-canvas/SKILL.md");
  assert.match(canvas, /canvas\.iota\.uz/);
  assert.match(canvas, /they win/);
  assert.match(canvas, /plot:plot-canvas-worker/);
});

test("contract.json names the server contract version that the changelog describes", () => {
  assert.match(contract.contractVersion, /^\d+\.\d+\.\d+$/);
  const version = JSON.parse(read(".claude-plugin/plugin.json")).version;
  const entry = read("../../CHANGELOG.md").split(/^## /m).find((section) => section.startsWith(version));
  assert.ok(entry?.includes(contract.contractVersion), `the ${version} changelog entry names the contract version`);
});
