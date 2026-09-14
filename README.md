# Plot plugin

Official agent workflows for [Plot](https://canvas.iota.uz): interfaces, interactive prototypes, diagrams, reports, videos, sound, and Character Studio production through the remote Plot MCP server.

The plugin contains two behavioral skills:

- `plot-canvas` for screens, documents, diagrams, reports, prototypes, and spatial canvases.
- `plot-video` for timed media, sound, renders, and character performances.

The skills teach an asset-first, evidence-driven workflow. They do not bundle the private Plot backend, credentials, or a static copy of the MCP tool catalog.

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
```

The first public release targets Claude Code and Codex CLI/Desktop. A registered ChatGPT Work app is a later phase.

## Release policy

Plugin versions follow semantic versioning. Each release updates both manifests and `CHANGELOG.md`, passes the validators above, and is published from an immutable `vX.Y.Z` Git tag. Tool schemas, providers, limits, and capability catalogs remain dynamic MCP resources rather than copied plugin documentation.
