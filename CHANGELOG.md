# Changelog

## 0.10.0 - 2026-11-02

Requires server contract 2.14.0; reconnect `/mcp` after the server update. `files.read` marks a partial read with `truncated:true` and `representation:"json"` returns a whole JSON file. `objects.restore_version` with `to:"accepted"` drops a draft that does not validate, and `objects.open` returns `accepted_source` for reading the accepted files. `error.applied` says whether an unknown outcome landed. The SDK accepts common guessed input forms and clamps numeric bounds.

## 0.9.0 - 2026-11-01

Requires the server with the `lookup` tool (contract 2.13.0). Reads that need no VM go through `lookup({method, input})`: finding a target, polling a receipt, help. `execute` stays for code and for `plot.sessions.open`. Reconnect `/mcp` to see the new tool.

## 0.8.0 - 2026-10-31

Requires server contract 2.12.0. The server exposes one tool, `execute`, running TypeScript against `plot.<namespace>.<method>`; the 54 per-feature tools are gone. The canvas and video skills, the canvas worker and the references are rewritten around it and carry judgement only; signatures come from `plot.help` and the server instructions. `contract.json` lists the registry operations, and the contract test checks every `plot.*` call the plugin names against them.

## 0.7.0 — 2026-10-20

- Batch archive/restore of old video exports, with protected approvals/publications/evidence and stable retries. Media bytes are retained.
- Preview/commit batch relocation of video projects with master, variants, motion library, requests, history and pinned media/movements. Requires server contract 2026-10-20 / backend 3.
- Lifecycle skill reference documents per-item atomicity, size limits, replay and direct cross-workspace calls.

## 0.6.0 - 2026-10-19

Matches the Plot tool contract of 2026-10-19 (`contract.json` `contractVersion`; the server lists its changes at `plot://tools`). Install together with that server release: the video changes are breaking.

- Rewrite `plot-video` for the reworked Video Studio: agents claim human requests (`video_request_list`/`claim`/`get`/`release`) and answer with proposals (`video_proposal_preview`, `video_proposal_submit`) that only a human accepts; agents never write script, timeline or variant documents directly. One master per project plus per-language variants (`video_variant_get`) that override text, voice and timing only. `STALE_BASE` means reread and recompute; Accept auto-rebases.
- Motion library instead of code workspaces: `video_motion_library_get` and `video_motion_shell` (`plot motion check|frame|preview`); modules reach the video as timeline clips `source:{kind:"motion",module,props}` through a proposal with `base_library_revision`. People see previews and props forms, never module source.
- Paid producers need `allowPaid` and the `request_id` of a claimed request whose policy allows paid work. Proposal Accept is not render approval; only a human approves an exact MP4 per language, and `video_publication_record` refuses without that approval (`APPROVAL_REQUIRED`).
- Proposal evidence ids are `result.evidenceId` of a rubric `video_render` (`rubricHash`+`rubricPolicy` from `execute` `tools.video_rubric_resolve`) or a `video_critique`, never job ids; plain renders, QA and frames register none.
- Character Studio requests: `character_studio_get`, `character_proposal_submit`; reuse published movements via `character_movement_list`/`character_movement_get`.
- Removed tools are rejected by the contract test: `video_loop_*`, `video_comment_*`, `video_code_*`, `video_*_patch`; `video_operation_get` is now `video_receipt_get`. `contract.json` lists every video tool the skill names.
- `references/side-effects-and-approval.md` and `references/recovery.md` describe proposals, request-gated paid work, per-language approval and video reconciliation.

## 0.5.0 - 2026-10-05

Matches the Plot tool contract of 2026-10-01; the changed defaults are server-side, so the plugin also works against older servers (there `wait_ms` is simply ignored by tools that lack it).

- No more poll loops: `canvas_snapshot` and `screen_inspect` wait inline by default (`wait_ms` 20000) and `job_get` long-polls until every requested job is terminal (default 25 s). The skill now says a queued/running receipt means a deep queue — repeat the same idempotency_key or call `job_get`, never a `wait_ms:0` poll loop. Needs the Plot server release carrying `adr/mcp/inline-wait-by-default.md`.
- `plot-canvas` stays within its 8000-character budget (7982): snapshot-tile and asset-attach wording tightened to make room.

## 0.4.0 - 2026-10-05

Still matches the Plot tool contract of 2026-10-01 (`contract.json` `contractVersion`); the new fields are additive, so the plugin also works against servers without them.

- Node-level handoff: writes answer `inspect.url` (and `comment_list` threads carry `url`) — a deep link that opens the canvas at the changed node (`?page=…&node=…`, one shared entry contract behind the SPA and the server). The skill's handoff rule and the inspect hook advice now say to give that deep link, never the bare canvas URL when the work is one node. Needs the Plot server release carrying those fields.
- `plot-canvas` stays within its 8000-character budget (7983): the handoff and verification wording was tightened to make room.

## 0.3.0 - 2026-10-05

Still matches the Plot tool contract of 2026-10-01 (`contract.json` `contractVersion`); the one new signal is additive, so the plugin also works against servers without it.

- Grouping advice: `canvas_save`/`canvas_patch` answers `structure_suggestion: {page_id, screen_count}` when a page holds eight-plus screens and no grouping structure (no groups, lanes, stages, boundaries or `nodes.pack` sections). The PostToolUse hook turns that into one-per-session advice to re-pack the page into titled sections (delivery states as titles) or wrap fixed-position screens in `groups`; the field itself is advice, never a warning. Needs the Plot server release carrying that field.
- `plot-canvas` keeps every screen of an eight-plus-screen page in a titled section and re-packs when a write answers `structure_suggestion`; screen-board conventions (sections by delivery state: Ready for dev / In development / Implemented; a design change to an implemented screen moves it back, with a comment thread recording the drift) live in `references/authoring-principles.md`.

## 0.2.0 - 2026-10-01

Matches the Plot tool contract of 2026-10-01 (`contract.json` `contractVersion`; the server lists its changes at `plot://tools`). Install together with that server release.

- Rewrite `plot-canvas` for that contract: read the canvas first, React screens, shared parts in a component library consumed through the `library_get` digest of its published version (`version:"draft"`, file tools with a library ref, `library_publish`), edits on the server with no local copies, program-produced data written by `execute` (`fetch`, `canvas.files.write`, `canvas.commit()`), and `asset_import` with `attach`.
- `canvas_save` `screens[]` is additive: it upserts the listed ids, never removes screens or pages, and answers `screens:{added, updated}`; a screen is removed with `canvas_patch` `nodes.remove`.
- Layout without coordinates: `screens.upsert` without `viewport.height` fits its own height; writes answer `fitted` and `fit_pending`, and `nodes.fit` is for the ids in `fit_pending` only, except `viewport_relative` (give an explicit viewport height) and `boundary` (`fit_blocked_by_boundary`: take the node out of its boundary); `nodes.pack` with `sections`, `origin`, `below`; call-level `page_id` on `canvas_patch`.
- Verification: snapshot the ids in `inspect` (`canvas_save`, `canvas_edit`, `canvas_patch`, and `canvas_commit.inspect` of `execute`) as `targets[]`; follow `tiles.next` unchanged for a tall node; failed captures sit in `captures[].error`. A failed `execute` is a tool error with `error.job` (`EXECUTE_REJECTED` names the host's reason; `EXECUTE_NOT_STARTED` needs a new idempotency key); a returned value is emitted and a commit that changed nothing says `no_change`. `references/recovery.md` covers `asset_import` item failures (`path_exists`, `retryable`) and the reread rule after a fit. `comment_complete` answers a thread, the reviewer resolves it.
- Parallel work: the lead pastes the library digest into each brief; file-only writes are guarded per path, document writes by draft revision; the worker rules say what to do on `file_changed`, `revision_conflict` and `edit_already_applied`. New `plot:plot-canvas-worker` subagent (Claude Code): preloads `plot-canvas`, has no Bash or file-writing tools. The rules live once more in `references/worker-rules.md` for clients without plugin agents; a test keeps the copies identical.
- Hooks: the process starts only after Plot writes and snapshots (was: before and after every Plot call). It keys on `inspect` (also inside `execute`'s `canvas_commit`), `fit_pending` and `tiles.next` instead of `recommendations`, and gives each reminder once per session. The pre-tool imagery reminder is removed. A SessionStart hook for the `compact` source re-injects about 700 characters: reload a schema before a call you cannot write exactly, plus the shapes the server instructions (cut at 2048 characters by Claude Code) do not show: call-level `page_id`, `screens.upsert` items, `nodes.fit` (and when it does not apply), `nodes.remove`, `tiles.next`.
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
