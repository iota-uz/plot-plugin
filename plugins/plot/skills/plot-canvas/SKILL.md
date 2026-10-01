---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design, and also when a coding task touches a Plot canvas on the side - the user mentions Plot, a canvas, a canvas:// or canvas.iota.uz link, or asks to keep a design in sync with code. Use plot-video instead when timed media is the primary output.
---

# Plot Canvas

The deliverable is a coherent, inspectable result that serves the person's task, not a run of tool calls. The server instructions and tool schemas own tool names, arguments and limits; when they disagree with this skill, they win. After a compaction read `plot://tools/<name>` before a call you cannot write exactly. This skill covers how to approach the work.

## Start from intent and the canvas

- Settle audience, job, content, target viewport and what "done" means. Infer secondary details instead of making the person design the solution.
- Read the canvas before changing it: `canvas_get`, `screen_tree`, `canvas_shell` for questions across files, `comment_list` for open threads. Continue the visual language of strong work.
- A coding task that touches a canvas on the side follows the same rules: changes go to the server through the tools; the repository is read, never mirrored.

## Decide what imagery and brand material must carry

For a place, product, portfolio or brand, real photography or supplied work is core content; a dashboard may need none. Gradients and empty image boxes demonstrate nothing. Search workspace and shared assets (`asset_list`, then `asset_get` with previews) by subject and role, compare candidates for crop, focal point and resolution, and attach the chosen immutable revision at an `/assets` path: a `canvas_save` file with `asset_ref`, or for an HTTPS source `asset_import` with `attach:{ref, dir}`, which binds each asset at `/assets/<dir>/<slug>.<ext>` of a canvas with a saved version and returns the `path`: import that path as is (slugs are Latin even for Cyrillic names; `path_exists`: another file holds it). Tags are user labels, not proof of origin or rights.

Reuse an existing logo or mark as is; never rebuild one from text, CSS or a generated imitation. If none exists, use a neutral text treatment or ask for the source. Keep supplied facts apart from invented demo copy.

## Build on the server

- Screens are React, written inline: `canvas_save` for the first write, `canvas_edit` for exact replacements, `canvas_patch` for structure. A `canvas_save` that carries `screens` replaces every page; add files to an existing canvas with a files-only save. Do not start legacy HTML screens.
- Shared parts (shell, navigation, buttons, cards) live in the component library the canvas imports or in `/src/components`, never as per-screen copies. Consume a library through `library_get({ref})`: a digest of its published version (exports with prop types, tokens, class names; `version:"draft"` for the draft), which is all that using it requires. Read library source only to change it: the file tools take the library ref (`version: N` reads a published version, else the draft), `canvas_edit` writes the draft, and canvases see it after `library_publish`.
- Edit on the server and keep no local copies, in `/tmp` or the repository: a draft is typed twice and drifts.
- Data a program produces, such as an API response turned into `/src/data/x.ts`, is produced on the server: `execute` with `fetch`, transform, `canvas.files.write(path, text)`, `canvas.commit()`. Retyping it into `canvas_save` pays for it twice.
- Reads and writes that feed each other, and bulk rewrites, belong in one `execute` (SDK: `canvas://sdk/canvas`; `workspace` instead of `ref` for assets, video, jobs). A run whose code failed is a tool error: `error.job` holds `job_id` and `canvas_commit`, `recovery` says what to do; a commit that landed is not rerun.
- Do not compute coordinates or heights. Register files with `canvas_patch` `{op:"screens.upsert", page_id, screens:[{id, title, file}]}` and no `viewport.height`: the node then follows its content (`canvas_save screens[]` without `viewport` too). A write that rebuilds it answers `fitted`, or `fit_pending` for screens it could not fit; fit only those with `{op:"nodes.fit", page_id, node_ids, reflow:true}`. Place screens with `{op:"nodes.pack", page_id, value:{sections:[{title, node_ids}], below:"<node id>"}}` or `origin:{x,y}`; repeating the call updates the section titles.
- Make the first pass substantive: hierarchy, typography, spacing, realistic content, accessible contrast, a sound layout at the target viewport, the states the brief needs. Follow the workspace theme, not a stock dashboard. A convincing static design is valid; add interaction when asked.

## Verify with evidence

- A write answers with `inspect:{page_id?, node_ids, count}`. Snapshot those nodes: `canvas_snapshot({ref, page_id, targets:[{type:"node", node_id:"home"}, …]})`, one item per id. `canvas_patch` and `execute` return no `inspect`; snapshot the nodes you changed (`upserted_screens`, `screen_tree`). A tall node returns its first tile and `tiles:{count, tile_height, next}`: pass `next` unchanged for the next tile (`count` includes this tile; the last has no `next`); `tile_revision_changed` means the draft moved mid-walk, so start over. Aim `crop:{y, height}` or `element` at a suspect region. A failed capture sits in `captures[].error`; the others still return. A successful save is not visual verification.
- Judge hierarchy, balance, image fit, rhythm, contrast, clipping. `visual_issues` are measurements to check: a horizontal scroller can be intentional. Name the defect and the fix, correct it, snapshot again. When the remaining choice is subjective, show the strongest direction and name the alternative.
- When asked to address review comments, answer each thread with `comment_complete({items:[{comment_id, summary}]})`; only the reviewer resolves it, but an open thread tells them nothing happened. Mark a state worth returning to with `canvas_checkpoint`.
- For ambiguous side effects or an unknown outcome, read [side effects and approval](../../references/side-effects-and-approval.md) and [recovery](../../references/recovery.md).

## Working in parallel

Split when screens or flows are separate files and the shared parts already exist, so workers only consume them. Do not split when workers would touch the same file (shell, theme, shared CSS), when the canvas has no components yet (build them first, `library_publish` a library, then fan out), or when the job is a few screens: the brief costs about what the work does.

As lead: read the canvas and the library digest once, and paste the digest into each brief; workers do not read the library. Give each worker whole files that only it writes. Afterwards fit the `fit_pending` screens, place the new ones with `nodes.pack`, snapshot the result, and report. In Claude Code, spawn `plot:plot-canvas-worker`, which carries the worker rules, with this brief as its prompt. Elsewhere, append the text of [worker rules](../../references/worker-rules.md).

```
Ref <ref>, page <page_id>. Task: <screens or flow, source of content>.
You own only: <file paths>. Never edit or delete other files; if a shared file needs a change, say so in your report.
Library digest (use it; do not read library source):
<digest>
```

File-only writes (`canvas_save` with files, `canvas_edit`, an `execute` commit that only writes or deletes `/src` files) are guarded per path, so workers on different files do not conflict. Everything else (`canvas_patch`, `canvas_checkpoint`, other `execute` commits) is guarded by the draft revision.

## Handoff

Give the canonical Plot URL, what changed and why, real warnings or limits, and the next meaningful choice. Do not bury the result under tool logs or internal metadata.
