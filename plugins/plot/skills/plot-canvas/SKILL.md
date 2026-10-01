---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design, and also when a coding task touches a Plot canvas on the side - the user mentions Plot, a canvas, a canvas:// or canvas.iota.uz link, or asks to keep a design in sync with code. Use plot-video instead when timed media is the primary output.
---

# Plot Canvas

The deliverable is a coherent, inspectable result for the person's task, not a run of tool calls. The server instructions and tool schemas own tool names, arguments and limits; when they disagree with this skill, they win. After a compaction read `plot://tools/<name>` before a call you cannot write exactly.

## Start from intent and the canvas

- Settle audience, job, content, target viewport and what "done" means; infer secondary details.
- Read the canvas before changing it: `canvas_get`, `screen_tree`, `canvas_shell` for questions across files, `comment_list` for open threads.
- A coding task that touches a canvas on the side follows the same rules: the repository is read, never mirrored.

## Decide what imagery and brand material must carry

For a place, product, portfolio or brand, real photography or supplied work is core content; a dashboard may need none. Search workspace and shared assets (`asset_list`, then `asset_get` with previews) by subject and role, compare candidates for crop and resolution, and attach the chosen immutable revision at an `/assets` path: a `canvas_save` file with `asset_ref`, or for an HTTPS source `asset_import` with `attach:{ref, dir}`, which binds each asset at `/assets/<dir>/<slug>.<ext>` of a canvas with a saved version and returns the `path`: import that path as is (slugs are Latin even for Cyrillic names). Items succeed or fail alone ([recovery](../../references/recovery.md)). Tags are user labels, not proof of origin or rights.

Reuse an existing logo as is; never rebuild one from text, CSS or an imitation. If none exists, use a neutral text treatment or ask for the source.

## Build on the server

- Screens are React, written inline: `canvas_save` first, `canvas_edit` for exact replacements, `canvas_patch` for structure. `screens[]` of `canvas_save` upserts the listed ids and never removes others (result `screens:{added, updated}`); remove a screen with `canvas_patch` `{op:"nodes.remove", id}`. Do not start legacy HTML screens.
- Shared parts (shell, navigation, buttons, cards) live in the component library the canvas imports or in `/src/components`, never in per-screen copies. Consume a library through `library_get({ref})`: a digest of its published version (exports with prop types, tokens, class names; `version:"draft"` for the draft), all that using it requires. Read library source only to change it: the file tools take the library ref (`version: N` reads a published version, else the draft); `canvas_edit` writes the draft, and canvases see it after `library_publish({ref, expected_revision})`. A library write names `published_version` next to the draft revision; a canvas and a library never share a ref (`ref_taken`).
- Edit on the server; keep no local copies in `/tmp` or the repository: a draft is typed twice and drifts.
- Data a program produces (an API response as `/src/data/x.ts`) is made on the server: `execute` with `fetch`, transform, `canvas.files.write(path, text)`, `canvas.commit()`, never retyped into `canvas_save`.
- Reads and writes that feed each other, and bulk rewrites, belong in one `execute` (SDK: `canvas://sdk/canvas`; `workspace` instead of `ref` for assets, video, jobs); a value the code returns is emitted. A failed run is a tool error: `error.job` holds `job_id` and `canvas_commit`, `recovery` says what to do (`EXECUTE_REJECTED` names the host's reason; `EXECUTE_NOT_STARTED` needs a new `idempotency_key`; a landed commit is not rerun). A commit that changed nothing says `no_change`.
- Do not compute coordinates or heights. Register files with `canvas_patch` `{page_id, operations:[{op:"screens.upsert", screens:[{id, title, file}]}]}` and no `viewport.height`: the node then follows its content (`canvas_save screens[]` without `viewport` too). Call-level `page_id` defaults every operation except `page.delete|move|duplicate`. A write that rebuilds the node answers `fitted`, or `fit_pending:{reason, count, pages}` for screens not fitted: `{op:"nodes.fit", node_ids, reflow:true}` for those ids only, except `viewport_relative` (a 100vh shell: set an explicit `viewport.height`) and `boundary` (`fit_blocked_by_boundary`: take the node out of its boundary first). Place screens with `{op:"nodes.pack", value:{sections:[{title, node_ids}], below:"<node id>"}}` or `origin:{x,y}`; repeating the call updates the section titles.
- Make the first pass substantive: hierarchy, typography, spacing, realistic content, accessible contrast, a sound layout at the target viewport, the states the brief needs. Follow the workspace theme. A convincing static design is valid; add interaction when asked.

## Verify with evidence

- A write (`canvas_save`, `canvas_edit`, `canvas_patch`, an `execute` commit in `canvas_commit.inspect`) answers `inspect:{page_id?, node_ids, count}` when something visible changed. Snapshot those nodes: `canvas_snapshot({ref, page_id, targets:[{type:"node", node_id:"home"}, …]})`, one item per id. A tall node returns its first tile and `tiles:{count, tile_height, next}`: pass `next` unchanged for the next tile (`count` includes this tile; the last has no `next`); `tile_revision_changed`: the draft moved, start over. Aim `crop:{y, height}` or `element` at a suspect region. A failed capture sits in `captures[].error` (`target_not_found`; `snapshot_store_timeout` and `batch_deadline`: ask again) and the others still return. A successful save is not visual verification.
- Judge hierarchy, balance, image fit, rhythm, contrast, clipping. `visual_issues` are measurements to check: a horizontal scroller can be intentional. Name the defect and the fix, correct it, snapshot again. If the remaining choice is subjective, show the strongest direction and name the alternative.
- When asked to address review comments, answer each thread with `comment_complete({items:[{comment_id, summary}]})`; only the reviewer resolves it. Mark a state worth returning to with `canvas_checkpoint`.
- For ambiguous side effects or an unknown outcome, read [side effects](../../references/side-effects-and-approval.md) and [recovery](../../references/recovery.md).

## Working in parallel

Split when screens or flows are separate files and the shared parts already exist. Do not split when workers would touch the same file (shell, theme, shared CSS), when no components exist yet (build them, `library_publish`, then fan out), or for a few screens: the brief costs what the work does.

As lead: read the canvas and the library digest once and paste the digest into each brief. Give each worker whole files that only it writes. Afterwards fit the `fit_pending` screens, place the new ones with `nodes.pack`, snapshot the result, and report. In Claude Code, spawn `plot:plot-canvas-worker` (it carries the worker rules) with this brief as its prompt; elsewhere append [worker rules](../../references/worker-rules.md).

```
Ref <ref>, page <page_id>. Task: <screens or flow, source of content>.
You own only: <file paths>. Never edit or delete other files; if a shared file needs a change, say so in your report.
Library digest (use it; do not read library source):
<digest>
```

File-only writes are guarded per path, so workers on different files do not conflict; document writes (`canvas_patch`, `canvas_checkpoint`, other `execute` commits) by the draft revision.

## Handoff

Give the canonical Plot URL, what changed and why, real warnings or limits, and the next choice. No tool logs or internal metadata.
