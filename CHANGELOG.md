# Changelog

## 0.2.0 - 2026-10-01

Matches the Plot server release of 2026-10-01 (flat `canvas_snapshot` targets, library digest, `inspect` in write responses, top-level `ref`/`workspace` in `execute`). Install together with that server release.

- Rewrite `plot-canvas` for the current contract: read the canvas first, React screens, shared parts in a component library consumed through its `library_get` digest, edits on the server with no local copies, program-produced data written with `execute` and `fetch`, layout with `screens.upsert` and `nodes.pack`, snapshots of the `inspect` nodes (tiles, `crop`, `element`), `comment_complete` for resolved threads. Name the tools and leave argument schemas to the server. Add a section on parallel work with a ready brief for subagents. The description now also triggers when a coding task touches a Plot canvas.
- Add the `plot:plot-canvas-worker` subagent (Claude Code): preloads `plot-canvas`, has no Bash or file-writing tools.
- Remove the "local drafting scratchpad is valid" wording and the staged-preview paragraph; `plot-video` uses `execute` with `workspace` instead of the removed `scope` object.
- Hooks: the process now starts only after Plot writes and snapshots (was: before and after every Plot call). Post-write advice keys on the `inspect` field instead of `recommendations`. The pre-tool imagery reminder is removed. A SessionStart hook for the `compact` source re-injects a short reminder to reload tool schemas.
- `contract.json` lists every tool the skills and the agent name; a new test keeps the two in step and rejects retired wording.

## 0.1.4 - 2026-09-14

- Plan the role of imagery and sound, compare existing assets visually, and distinguish relevance labels from verified provenance.
- Review individual screens at legible size and refine observed design issues without mandatory interactivity.
- Add model-independent, nonblocking PreToolUse/PostToolUse reminders. No network, model calls, transcript inspection, argument rewriting or Stop gates; Codex hook trust remains user-controlled.

## 0.1.3 - 2026-09-14

- Prioritize visual design and maintainable HTML; production interactions are scoped to the user's request.
- Document current staged preview, draft resume and commit workflows and operation-native canvas concurrency.
- Route coordinated authoring to the live execute SDK resources, including workspace canvas creation.

## 0.1.2 - 2026-09-14

- Give each Claude Code MCP connection an implicit Plot agent session without exposing session bookkeeping to the model.

## 0.1.1 - 2026-09-14

- Add a machine-readable compatibility contract for cross-repository validation.

## 0.1.0 - 2026-09-14

- Add shared `plot-canvas` and `plot-video` behavioral skills.
- Add asset-first canvas and video workflows, including sound production and render review.
- Add Claude Code and Codex plugin manifests backed by the remote Plot MCP server.
