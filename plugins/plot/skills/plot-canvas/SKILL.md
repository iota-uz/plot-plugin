---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design, and also when a coding task touches a Plot canvas on the side - the user mentions Plot, a canvas, a canvas:// or canvas.iota.uz link, or asks to keep a design in sync with code. Use plot-video instead when timed media is the primary output.
---

# Plot Canvas

The deliverable is a coherent, inspectable result that serves the person's task, not a run of tool calls. The server instructions and tool schemas own tool names, arguments and limits; when they disagree with this skill, they win. This skill covers how to approach the work.

## Start from intent and the canvas

- Settle audience, job, content, target viewport and what "done" means. Infer secondary details instead of making the person design the solution.
- Read the canvas before changing it: `canvas_get`, `screen_tree`, `canvas_shell` for questions across files, `comment_list` for open threads. Keep strong work and continue its visual language. Reading first is also how you learn which component library it already uses.
- A coding task that touches a canvas on the side follows the same rules. The canvas lives on the server, so changes go there through the tools; the repository is read, never mirrored.

## Decide what imagery and brand material must carry

For a place, product, portfolio or brand, real photography or supplied work is core content; a dashboard may need none. Choose on purpose, since gradients and empty image boxes demonstrate nothing. Search workspace and shared assets (`asset_list`, then `asset_get` with previews) by subject and role, compare candidates for crop, focal point and resolution, and attach the chosen immutable revision at an `/assets` path (a `canvas_save` file with `asset_ref`; `asset_import` with `attach` for an HTTPS source). Tags are user labels, not proof of origin or rights.

Reuse an existing logo or mark as is; never rebuild one from text, CSS or a generated imitation. If none exists, use a neutral text treatment or ask for the source. Keep supplied facts apart from invented demo copy.

## Build on the server

- Screens are React, written inline: `canvas_save` for the first write, `canvas_edit` for exact replacements, `canvas_patch` for structure. A `canvas_save` that carries `screens` replaces every page; add files to an existing canvas with a files-only save. Legacy HTML screens still render, but starting one copies markup that components would share.
- Shared parts (shell, navigation, buttons, cards) live in the component library the canvas imports or in `/src/components`, never as per-screen copies. Consume a library through its digest from `library_get` (exports with prop types, tokens, class names); that is what using it requires. Open a library file with `canvas_file_get` only to change the library.
- Edit on the server and keep no local copies, in `/tmp` or the repository: a draft is typed twice and drifts from what is stored.
- Data a program produces, such as an API response turned into `/src/data/x.ts`, is produced on the server: `execute` with `fetch`, transform, `canvas.files.write`, commit. Retyping it into `canvas_save` pays for it twice.
- Several reads or writes that feed each other, and bulk rewrites, belong in one `execute`; signatures are in `canvas://sdk/canvas`, schemas at `plot://tools/<name>`.
- Do not compute coordinates. Put files on screens with `screens.upsert`, place them with `nodes.pack` sections (titled rows), and let the server fit heights (`nodes.fit`).
- Make the first pass substantive: hierarchy, typography, spacing, realistic content, accessible contrast, sound layout at the target viewport, and the states the brief needs. Follow the workspace theme without producing the same dashboard every time. A convincing static design is a valid result; add interaction when asked.

## Verify with evidence

- A write answers with `inspect` (a page and up to eight node ids). Look at those nodes with `canvas_snapshot`. A tall screen returns its first tile and `tiles.next`; pass that on unchanged for the next tile, or aim `crop`/`element` at a suspect region. A successful save is not visual verification.
- Judge hierarchy, balance, image fit, rhythm, contrast, clipping. `visual_issues` are measurements to check: a horizontal scroller can be intentional. Name the defect and the intended fix, correct it, snapshot again. When the remaining choice is subjective, show the strongest direction and name the alternative.
- When asked to address review comments, close each thread you resolved with `comment_complete`; an open thread tells the reviewer nothing happened. Mark a state worth returning to with `canvas_checkpoint`.
- For ambiguous side effects or an unknown outcome, read [side effects and approval](../../references/side-effects-and-approval.md) and [recovery](../../references/recovery.md).

## Working in parallel

Split when screens or flows are separate files and the shared parts already exist, so each worker only consumes them. Do not split when workers would touch the same file (shell, theme, shared CSS), when the canvas has no library or components yet (build those yourself first, then fan out), or when the job is a few screens: writing the brief costs about what the work does.

As lead: read the canvas and read the library digest once. Give each worker whole files that only it writes. Afterwards place the new screens with `nodes.pack`, snapshot the result, and report. In Claude Code, spawn `plot:plot-canvas-worker`, which already carries these rules, and paste only the brief below as its prompt. Elsewhere, paste the whole brief.

```
Ref <ref>, page <page_id>. Task: <screens or flow, source of content>.
You own only: <file paths>. Never edit or delete other files; if a shared file needs a change, say so in your report.
Library digest (use it; do not read library source):
<digest>
Rules:
- Write straight to Plot: canvas_save with files only, never screens (screens replaces every page, including other workers' nodes), then canvas_edit. No drafts in /tmp or the repository: they are typed twice.
- Use library components and tokens; do not copy markup.
- Data from a program: execute with fetch, then canvas.files.write.
- Other agents write at the same time: no canvas_checkpoint, no execute commits that touch files outside yours, no moving other nodes.
- On a timeout, 429 or 5xx, repeat the same call unchanged, same idempotency_key. A new key repeats the effect. On a revision conflict, reread the file and redo the edit.
- Register your screens with screens.upsert and no coordinates; the lead places them.
- Snapshot the nodes in `inspect`, fix defects, snapshot again.
Report: files written, node ids, what the snapshots showed, anything unresolved. No code.
```

## Handoff

Give the canonical Plot URL, what changed and why, real warnings or limits, and the next meaningful choice. Do not bury the result under tool logs or internal metadata.
