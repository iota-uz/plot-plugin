# Client compatibility

The two Plot skills contain the shared behavior contract for Claude Code and Codex. Client manifests are thin adapters and must not fork the skill content.

The remote MCP connection requires authentication. This repository contains no credentials. Claude Code reads `PLOT_MCP_TOKEN` through `.mcp.json`; other clients should use their supported secure environment or OAuth setup.

Plot scopes read-before-write context to an MCP connection. The MCP transport normally carries that identity in `MCP-Session-Id`. Claude Code versions that do not echo the server-issued header use the bundled `headersHelper`, which creates a fresh `X-Plot-Agent-Session` for each connection. This is transport bookkeeping: never ask the model to provide or preserve either header.

Already-running sessions may retain an older cached plugin. Validate a release in a clean installation and a new session for each supported client.

## Advisory hooks

`hooks/hooks.json` registers two hooks, both fail-open and advisory:

- PostToolUse, matched only to Plot write and snapshot tools (`canvas_save`, `canvas_edit`, `canvas_apply_patch`, `canvas_patch`, `canvas_nodes_move`, `canvas_nodes_delete`, `execute`, `canvas_snapshot`). Reads, library and asset calls never start the script. It reacts to structured fields the server returns (contract 2026-10-01): `inspect` of a write response (nodes worth a snapshot; an `execute` commit has none, so rebuilt `build.changed_screens` or `fitted` stand in), `fit_pending` (screens the write could not fit: `nodes.fit` for those ids only), `tiles.next` of a snapshot (top level or in `captures[]`: pass it on unchanged), `visual_issues` and `suggested_previews`. Each reminder is given once per session; an already given one does not hide another.
- SessionStart with the `compact` source. After a conversation is compacted, Claude Code no longer holds the Plot tool schemas; the server instructions survive (Claude Code cuts them at 2048 characters, and the server keeps the common signatures before the cut). The hook re-injects a reminder of about 700 characters: reload a schema before a call you cannot write exactly, plus the shapes the instructions do not show (`screens.upsert` items, `nodes.fit`, `inspect.node_ids` as snapshot `targets[]`, `tiles.next`). It speaks only in sessions where the PostToolUse hook has already run for a Plot tool.

The hooks never inspect JavaScript source to infer operations, read transcripts, contact a service, invoke a model, change tool arguments, block a call or gate completion. Only a hashed session filename and the advice keys already given are cached in the OS temporary directory with a seven-day logical expiry; no task content is stored. Concurrent calls may repeat advice, but cannot affect tool execution. There is no PreToolUse hook: advice that arrives after the model has composed a call cannot change that call, and a read-only call is no reason to start a process.

Codex requires review and trust of the current hook definition; installation does not grant that trust. Review it in the client's hooks UI. Codex may not fire SessionStart for the `compact` source; the reminder is then simply absent. A disabled or untrusted hook leaves all MCP features usable: the skill and structured MCP diagnostics carry the same guidance. Claude Code uses its normal plugin hook permissions. There are no Stop hooks.

## Canvas worker agent

`agents/plot-canvas-worker.md` is a Claude Code subagent (`plot:plot-canvas-worker`) for parallel canvas work. It preloads the `plot-canvas` skill through the `skills` frontmatter field, inherits the session's Plot tools, and has no Bash or file-writing tools (it reads local code with Read and Grep), which removes the local-draft failure structurally. Its rules (own files only, files-only `canvas_save`, `screens.upsert`, what to do on each conflict code) are also in `references/worker-rules.md` for clients without plugin agents; a test keeps the two identical. Claude Code ignores `hooks`, `mcpServers` and `permissionMode` in plugin agents, so the definition does not use them. Codex has no equivalent plugin agent definition; the brief template in the `plot-canvas` skill carries the same rules into a subagent prompt.
