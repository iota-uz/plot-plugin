# Client compatibility

The two Plot skills contain the shared behavior contract for Claude Code and Codex. Client manifests are thin adapters and must not fork the skill content.

The remote MCP connection requires authentication. This repository contains no credentials. Claude Code reads `PLOT_MCP_TOKEN` through `.mcp.json`; other clients should use their supported secure environment or OAuth setup.

Already-running sessions may retain an older cached plugin. Validate a release in a clean installation and a new session for each supported client.
