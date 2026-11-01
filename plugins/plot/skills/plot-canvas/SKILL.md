---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design, and also when a coding task touches a Plot canvas on the side - the user mentions Plot, a canvas, a canvas:// or canvas.iota.uz link, or asks to keep a design in sync with code. Use plot-video instead when timed media is the primary output.
---

# Plot Canvas

The deliverable is a coherent, inspectable result, not a run of calls. `execute` runs TypeScript in a VM calling `plot.<namespace>.<method>(input)`. `lookup({method, input})` answers `objects.find`, `receipts.get`, `receipts.list`, `artifacts.read`, `help` and `media.capabilities` at once with no VM: use it to find a target and to poll a receipt. The server instructions and `plot.help` own names, signatures and limits; when they disagree with this skill, they win. Unsure of a call: `plot.help({topic})` (a namespace, a method name, `"guides"` or `"guide:<id>"`) before guessing. Task guides worth reading once: `guide:screens`, `guide:canvas-document`, `guide:libraries`, `guide:visual-loop`.

## Start from intent and the canvas

- Settle audience, job, content, target viewport and what "done" means; infer the rest.
- Read before changing: `plot.objects.open`, then `plot.files.list`/`plot.files.read` (a partial read has `truncated:true` and does not parse; `representation:"json"` returns a whole JSON file) and `plot.objects.read`; `plot.inspect` for geometry; `plot.comments.read` for open review threads.
- A coding task that touches a canvas on the side follows the same rules: the repository is read, never mirrored.

## Imagery and brand material

For a place, product or brand, real photography or supplied work is core content; a dashboard may need none. Search workspace and shared assets (`plot.assets.find`, `plot.assets.read`) by subject and role, compare candidates for crop and resolution, and bind the chosen immutable revision with `plot.assets.bind`; import from a URL with `plot.assets.import`. Tags are user labels, not proof of origin or rights. Reuse an existing logo as is; never rebuild one. If none exists, use a neutral text treatment or ask for the source.

## Build on the server

- Screens are React files under `/src`, written through `plot.files.apply` with the `expected_hash` from `plot.files.read` (null creates). Edit the source in Plot; keep no copies in `/tmp` or the repo. Do not start legacy HTML screens.
- Shared parts (shell, navigation, buttons, cards) live in the component library the canvas imports or in shared files under `/src`, never in per-screen copies. Read a library's public API with `plot.objects.read` facets (`exports`, `types`, `styles`); read library source only to change it. Publishing is `plot.releases.create`, a separate step.
- Node and page changes go through `plot.edit.apply` (typed commands, schema from `plot.objects.open` documents) rather than rewriting `/canvas/document.json`. Do not compute coordinates by hand: place many screens with the pack command in sections, and read the commit's `diagnostics` (`NODE_OVERLAP` and compile errors are warnings, not rollbacks).
- Data a program produces (an API response as `/src/data/x.ts`) is generated in the session with `plot.processes.exec` or in the `execute` code and written with `plot.files.apply`, never retyped by hand.
- Reads and writes that feed each other belong in one `execute`; emit what you need back with `emit(value)`. Writes return a SourceCommit; reopen with `plot.objects.open` before the next write.
- A page of eight-plus screens keeps every screen in a titled section, not a flat wall. Section titles by delivery state (`Ready for dev`, `In development`, `Implemented`) turn it into a handoff board; titles are prose in any language, and a design change to an implemented screen moves it back to `Ready for dev`. Repeating the pack with different membership moves screens and updates titles.
- Make the first pass substantive: hierarchy, typography, spacing, realistic content, accessible contrast, a sound layout at the target viewport, the states the brief needs. Follow the workspace theme (`plot.context.read`). A convincing static design is valid; add interaction when asked.

## Verify with evidence

- After a meaningful change, `plot.preview({source})` then `plot.tasks.wait({tasks})`; images come back as native media. `plot.compare` diffs two revisions, `plot.inspect` measures without rendering. Read the full compile with `plot.objects.read` facet `build`.
- Judge hierarchy, balance, image fit, rhythm, contrast. Measurements are evidence to check, not verdicts: a horizontal scroller can be intentional. Name the defect and the fix, correct it, preview again. If the remaining choice is subjective, show the strongest direction and name the alternative.
- `plot.comments.write` answers a review thread; `plot.comments.transition` changes its state only when the user's role allows it. Name a revision worth returning to with `plot.objects.checkpoint`.
- Failed capture or timeout is not a failed design: ask again before concluding anything.
- Side effects and unknown outcomes: [side effects](../../references/side-effects-and-approval.md), [recovery](../../references/recovery.md).

## Working in parallel

Split when screens or flows are separate files and shared parts exist. Do not split when workers would touch the same file (shell, theme, shared CSS), when no components exist yet (build them, release them, then fan out), or for a few screens.

As lead: read the canvas and the library API once and paste it into each brief. Give each worker whole files that only it writes. Afterwards do the shared work (document placement, sections, checkpoints), preview, and report. In Claude Code, spawn `plot:plot-canvas-worker` with this brief as its prompt; elsewhere append [worker rules](../../references/worker-rules.md).

```
Target <target or session_id>. Task: <screens or flow, source of content>.
You own only: <file paths>. Never edit or delete other files; if a shared file needs a change, say so in your report.
Library API (use it; do not read library source):
<exports/types/styles summary>
```

Every write carries `expected_hash` per path, so workers on different files do not conflict; two writers on the same path get `READ_CONFLICT`.

## Handoff

Give the deep link of what changed (`SourceCommit.url`, or the object's `url` plus page/node), never the bare canvas URL for one node's work, plus what changed and why, real warnings, and the next choice. No call logs.
