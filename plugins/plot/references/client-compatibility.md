# Client compatibility

The two Plot skills contain the shared behavior contract for Claude Code and Codex. Client manifests are thin adapters and must not fork the skill content.

The remote MCP connection requires authentication. This repository contains no credentials. Claude Code reads `PLOT_MCP_TOKEN` through `.mcp.json`; other clients should use their supported secure environment or OAuth setup.

Plot scopes read-before-write context to an MCP connection. The MCP transport normally carries that identity in `MCP-Session-Id`. Claude Code versions that do not echo the server-issued header use the bundled `headersHelper`, which creates a fresh `X-Plot-Agent-Session` for each connection. This is transport bookkeeping: never ask the model to provide or preserve either header.

Already-running sessions may retain an older cached plugin. Validate a release in a clean installation and a new session for each supported client.
