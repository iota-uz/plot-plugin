---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design; use plot-video instead when timed media is the primary output.
---

# Plot Canvas

Produce a coherent, inspectable result that serves the person’s actual task. Tool usage is not the deliverable.

## Begin from intent and existing state

- Establish the audience, job, content, target device or viewport, interaction if requested, and what “done” means. Infer secondary details when safe instead of making the person design the solution for you.
- For an existing Plot ref, read its current structure, theme, relevant comments, and human-authored notes before changing it. Preserve strong work and continue its visual language.
- Use `resource_find` and `resource_get` only when a template, theme, workflow, or capability detail is needed. The MCP server is the source of truth for current tools and schemas; do not load the complete catalog by default.

## Choose the role of imagery, then find materials

Decide what the person needs to see to believe or understand the design. For a physical place, product, portfolio or brand, relevant photography or supplied work is often core content, not decoration to add after styling. A dashboard or editorial composition may work better without imagery. Make that choice intentionally; gradients and empty image-shaped boxes do not demonstrate a place or product.

Search by subject and intended role (for example, workspace interiors for a coworking landing), then refine based on results. Compare a small set visually for content, crop, focal point, tone and available resolution before polishing the layout around it. Search is a way to make a better design, not a quota of tool calls.

Before drawing or generating a logo, icon, illustration, photo, font, or other brand material:

1. Search the workspace library for project-specific assets and the shared library for organization-wide assets. Use a focused semantic query and the relevant kind.
2. Compare compact previews from `asset_list` (use `preview_limit` to control output), and inspect promising candidates with `asset_get(include_preview:true)`; do not choose solely by filename. Canvas-scoped `canvas.assets.search` also returns ranked metadata and preview URLs. Ranking confidence is relevance, not authenticity. Tags such as `brand` or `approved` are user labels, not independent verification of source or rights.
3. Attach the chosen immutable revision with `asset_attach` and use its stable `/assets/...` path.

Prefer a suitable existing asset over generating a new one. Never reconstruct an available official logo with text, CSS shapes, or a generated imitation. If no official mark is available, use a neutral text treatment or ask for the source when the mark is important; do not present an invented emblem as official. Preserve authored SVG bytes.

When results are empty or unsuitable, broaden the subject, inspect the other library, import or generate appropriate imagery, or deliberately choose a typography-led direction. Keep supplied facts/materials distinct from invented demo copy and placeholders. Do not suggest the library contained assets you did not find.

## Author the right form

- Choose the form that fits the request: single screen, routed prototype, spatial CanvasDoc, diagram, report, or imported artifact.
- Select one relevant template/theme/workflow when useful; avoid mixing unrelated aesthetics.
- Make the first pass substantive: clear hierarchy, strong typography and spacing, realistic content, suitable imagery, accessible labels/contrast, and sound layout at target viewports. Show additional states when relevant to the brief. Static design screens are valid; implement interactive behavior only when requested.
- Keep HTML maintainable with semantic elements, reusable classes and shared styles. Separate mobile artboards are valid. Judge actual layout quality rather than requiring JS, media queries, or a framework.
- Treat workspace brand and semantic theme as constraints without turning every result into the same dashboard. Avoid generic card grids, gratuitous gradients, weak typography, decorative filler, and duplicated device chrome.
- Inline HTML and a local drafting scratchpad are both valid. Judge the saved Plot result, and avoid leaving unnecessary temporary files in the user’s repository.

For one simple lifecycle action or focused edit, use the direct canvas tool. For work that needs several reads, asset comparison, transformations, drawing/layout helpers, or coordinated changes, use `execute` with `scope:{kind:"canvas",ref}`. Read the relevant `canvas://sdk/canvas` or `canvas://sdk/workspace` chapter for current signatures and compact examples. Workspace execute can create the canvas directly with `workspace.canvas.create`. Inside a canvas run, read bounded state/files, search and inspect assets, stage document/file/attachment changes, and inspect `canvas.diff()`. Call `canvas.preview()` without commit for a staged image and `draft_id`; inspect it, then continue with that `draft_id` in another canvas-scoped execute. Call `canvas.commit()` once when ready. An exception before commit persists no canvas change. A returned revision conflict means reread and recompute; it must not overwrite newer work.

Attaching an existing immutable asset is part of canvas staging. Importing or generating a new asset through an allowed subject tool is an independent durable effect and is not rolled back if the later canvas commit conflicts. Inspect the execute job’s canvas commit and independent effects separately. Put ordinary data in code literals or read it from the scoped SDK; there is no separate injected input payload.

## Iterate from evidence

- Prefer focused edits and patches for local changes. Keep stable refs; exact source edits and structural patches handle concurrency internally, without manually passing hashes or versions.
- After a meaningful visual change, snapshot the smallest changed target and inspect the actual output. Fix clipping, overlap, overflow, broken assets, unreadable text, and visual inconsistencies before declaring it ready.
- Use the overview for composition and a focused node preview for screen-level judgment, especially when a phone sits beside a tall desktop page. Read `suggested_previews` and `visual_issues` when present. Measurements flag review candidates, not automatic defects: a horizontal scroller can be intentional. Check fixed-height flex layouts for compressed children, cropped content, and typography that silently fell back after a font change.
- For an uncommitted draft, resume its `draft_id` and call `canvas.preview({node_id: "screen-id"})` for focused review. A staged preview does not require committing or adding a change.
- Judge hierarchy, balance of content and whitespace, image relevance/crop, typographic rhythm, contrast and consistency. Name the observed problem and the intended improvement before a focused revision. Avoid adding interaction merely to satisfy a checklist; a convincing static design is a valid result.
- Inspect staged previews before commit when useful. A direct commit followed by `canvas_snapshot` is also valid. Verify the displayed revision and fix observed defects; do not infer quality from a successful save.
- Keep refinement bounded to observed defects or a concrete hypothesis. When the remaining choice is subjective, show the strongest direction and name the meaningful alternative.

For ambiguous side effects or recovery after an unknown outcome, read [side effects and approval](../../references/side-effects-and-approval.md) and [recovery](../../references/recovery.md).

## Handoff

Give the person the canonical Plot URL, a concise description of what changed and why, real warnings or limitations, and the next meaningful choice. Do not bury the result under tool logs or internal metadata.
