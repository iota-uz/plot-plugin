# Changelog

## 0.2.0 - 2026-10-01

Matches the Plot tool contract of 2026-10-01 (`contract.json` `contractVersion`; the server lists its changes at `plot://tools`). Install together with that server release.

- Rewrite `plot-canvas` for that contract: read the canvas first, React screens, shared parts in a component library consumed through the `library_get` digest of its published version (`version:"draft"`, file tools with a library ref, `library_publish`), edits on the server with no local copies, program-produced data written by `execute` (`fetch`, `canvas.files.write`, `canvas.commit()`), and `asset_import` with `attach`.
- Layout without coordinates: `screens.upsert` without `viewport.height` fits its own height; writes answer `fitted` and `fit_pending`, and `nodes.fit` is for the ids in `fit_pending` only; `nodes.pack` with `sections`, `origin`, `below`.
- Verification: snapshot the ids in `inspect` as `targets[]`; `canvas_patch` and `execute` return no `inspect`; follow `tiles.next` unchanged for a tall node; failed captures sit in `captures[].error`. A failed `execute` is a tool error with `error.job`. `comment_complete` answers a thread, the reviewer resolves it.
- Parallel work: the lead pastes the library digest into each brief; file-only writes are guarded per path, document writes by draft revision; the worker rules say what to do on `file_changed`, `revision_conflict` and `edit_already_applied`. New `plot:plot-canvas-worker` subagent (Claude Code): preloads `plot-canvas`, has no Bash or file-writing tools. The rules live once more in `references/worker-rules.md` for clients without plugin agents; a test keeps the copies identical.
- Hooks: the process starts only after Plot writes and snapshots (was: before and after every Plot call). It keys on `inspect` (for `execute`: rebuilt `build.changed_screens` or `fitted`), `fit_pending` and `tiles.next` instead of `recommendations`, and gives each reminder once per session. The pre-tool imagery reminder is removed. A SessionStart hook for the `compact` source re-injects about 700 characters: reload a schema before a call you cannot write exactly, plus the shapes the server instructions (cut at 2048 characters by Claude Code) do not show: `screens.upsert` items, `nodes.fit`, `inspect.node_ids` as `targets[]`, `tiles.next`.
- Remove the "local drafting scratchpad is valid" wording and the staged-preview paragraph; `plot-video` uses `execute` with `workspace` instead of the removed `scope` object.
- `contract.json` lists every tool the skills and the agent name (now also `library_publish` and `canvas_save_receipt`); the contract test finds tools inside call-shaped code spans and rejects retired wording.

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
