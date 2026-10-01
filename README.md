# Plot plugin

Official agent workflows for [Plot](https://canvas.iota.uz): interfaces, interactive prototypes, diagrams, reports, videos, sound, and Character Studio production through the remote Plot MCP server.

The plugin contains two behavioral skills:

- `plot-canvas` for screens, documents, diagrams, reports, prototypes, and spatial canvases.
- `plot-video` for timed media, sound, renders, and character performances.

The skills teach how to approach the work: read the canvas first, build React screens on a shared component library, edit on the server without local copies, and verify the result with snapshots. The server instructions and tool schemas stay the source of truth for tool names and arguments; the plugin does not bundle the private Plot backend, credentials, or a copy of the tool catalog. This release (0.2.0) matches the Plot tool contract of 2026-10-01 (`plot://tools` lists its changes); `contract.json` records the version and the tools the skills name.

Claude Code also gets:

- `plot:plot-canvas-worker`, a subagent for one parallel slice of canvas work. It preloads `plot-canvas`, has no Bash or file-writing tools, and expects the canvas ref, its own file paths and the library digest in its prompt. Codex has no plugin agents; the brief in `plot-canvas` plus `references/worker-rules.md` serve there.
- Advisory hooks that start a process only after Plot writes and snapshots (they point at `inspect`, `fit_pending` and `tiles.next`), plus a reminder after a conversation is compacted: Claude Code drops the tool schemas, and the server instructions (cut at 2048 characters) show the common signatures but not every call shape, so the reminder adds the rest.

## Authentication

The remote server enforces its own authentication, workspace scope, and authorization. Set your Plot MCP token in the environment before starting the client:

```sh
export PLOT_MCP_TOKEN="plot_..."
```

No credential belongs in this repository or in a committed client config.

## Claude Code

Add the public marketplace and install `plot`:

```sh
claude plugin marketplace add iota-uz/plot-plugin
claude plugin install plot@iota-uz
```

The bundled `.mcp.json` connects to `https://canvas.iota.uz/mcp`, reads `PLOT_MCP_TOKEN` from the environment, and gives each connection an implicit session header for safe read-before-write behavior. Start a new Claude Code session after installation or update.

## Codex CLI and Desktop

Add the public marketplace and install `plot`:

```sh
codex plugin marketplace add iota-uz/plot-plugin --ref main
codex plugin add plot@iota-uz
```

Start a new task so the two skills and Plot MCP dependency are discovered. Running tasks may retain a cached older plugin version.

## Development

Validate the client adapters before release:

```sh
python3 /path/to/plugin-creator/scripts/validate_plugin.py plugins/plot
python3 /path/to/skill-creator/scripts/quick_validate.py plugins/plot/skills/plot-canvas
python3 /path/to/skill-creator/scripts/quick_validate.py plugins/plot/skills/plot-video
claude plugin validate --strict .
node --test plugins/plot/scripts/*.test.mjs
```

The tests cover the hooks and a contract check: every tool the skills, the worker agent and `references/worker-rules.md` name is listed in `plugins/plot/contract.json` (`requiredTools`, verified against the server by the Plot repository), the two copies of the worker rules are identical, `plot-canvas` stays within 8000 characters, and no skill carries wording the server forbids. In the Plot repository, `PLOT_PLUGIN_DIR=<this checkout> NODE_ENV=test npx vitest run test/plugin-contract.test.ts` (in `apps/mcp`) checks the tool names against the server's tool list.

The first public release targets Claude Code and Codex CLI/Desktop. A registered ChatGPT Work app is a later phase.

## Release policy

Plugin versions follow semantic versioning. Each release updates both manifests and `CHANGELOG.md`, passes the validators above, and is published from an immutable `vX.Y.Z` Git tag. Tool schemas, providers, limits, and capability catalogs remain dynamic MCP resources rather than copied plugin documentation.
