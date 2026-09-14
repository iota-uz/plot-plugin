# Client compatibility

The two Plot skills contain the shared behavior contract for Claude Code and Codex. Client manifests are thin adapters and must not fork the skill content.

The remote MCP connection requires authentication. This repository contains no credentials. Claude Code reads `PLOT_MCP_TOKEN` through `.mcp.json`; other clients should use their supported secure environment or OAuth setup.

Plot scopes read-before-write context to an MCP connection. The MCP transport normally carries that identity in `MCP-Session-Id`. Claude Code versions that do not echo the server-issued header use the bundled `headersHelper`, which creates a fresh `X-Plot-Agent-Session` for each connection. This is transport bookkeeping: never ask the model to provide or preserve either header.

Already-running sessions may retain an older cached plugin. Validate a release in a clean installation and a new session for each supported client.

## Advisory hooks

`hooks/hooks.json` uses the shared PreToolUse/PostToolUse additionalContext contract. Codex supplies `CLAUDE_PLUGIN_ROOT` as a compatibility alias. Hooks offer one early asset reminder and deduplicated visual-review advice based on structured Plot results, including execute results. They never inspect JavaScript source to infer operations, read transcripts, contact a service, invoke a model, change tool arguments, block a call or gate completion. Only hashed session filenames and four reminder keys are cached in the OS temporary directory with a seven-day logical expiry; no task content is stored. Concurrent calls may repeat advice, but cannot affect tool execution.

Codex requires review and trust of the current hook definition; installation does not grant that trust. Review it in the client's hooks UI. A disabled or untrusted hook leaves all MCP features usable: the skill and structured MCP diagnostics carry the same guidance. Claude Code uses its normal plugin hook permissions. There are no Stop hooks.
