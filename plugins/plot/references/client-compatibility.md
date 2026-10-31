# Client compatibility

The two Plot skills contain the shared behavior contract for Claude Code and Codex. Client manifests are thin adapters and must not fork the skill content.

The remote MCP connection requires authentication. This repository contains no credentials. Claude Code reads `PLOT_MCP_TOKEN` through `.mcp.json`; other clients should use their supported secure environment or OAuth setup.

Plot scopes read-before-write context to an MCP connection. The MCP transport normally carries that identity in `MCP-Session-Id`. Claude Code versions that do not echo the server-issued header use the bundled `headersHelper`, which creates a fresh `X-Plot-Agent-Session` for each connection. This is transport bookkeeping: never ask the model to provide or preserve either header.

Already-running sessions may retain an older cached plugin. Validate a release in a clean installation and a new session for each supported client.

## Advisory hook

`hooks/hooks.json` registers one advisory, fail-open hook owned by `scripts/design-context.mjs`: after a conversation is compacted it reminds the model that Plot exposes one tool, `execute`, and that `plot.help` returns signatures. It reads no transcript, contacts no service, invokes no model, changes no call arguments and blocks nothing. Codex requires review and trust of the current hook definition; a disabled or untrusted hook leaves everything usable.

## Canvas worker agent

`agents/plot-canvas-worker.md` is a Claude Code subagent (`plot:plot-canvas-worker`) for parallel canvas work. It preloads the `plot-canvas` skill, inherits the session's Plot tool, and has no Bash or file-writing tools (it reads local code with Read and Grep), which removes the local-draft failure structurally. Its rules are also in `references/worker-rules.md` for clients without plugin agents; a test keeps the two identical. Claude Code ignores `hooks`, `mcpServers` and `permissionMode` in plugin agents. Codex has no equivalent definition; the brief template in the `plot-canvas` skill carries the same rules into a subagent prompt.
