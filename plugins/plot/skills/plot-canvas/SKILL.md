---
name: plot-canvas
description: Create or revise interfaces, interactive prototypes, diagrams, reports, and canvas artifacts in Plot. Use when the requested result is a screen, document, spatial canvas, workflow, or inspectable design; use plot-video instead when timed media is the primary output.
---

# Plot Canvas

Produce a coherent, inspectable result that serves the person’s actual task. Tool usage is not the deliverable.

## Begin from intent and existing state

- Establish the audience, job, content, target device or viewport, required interaction, and what “done” means. Infer secondary details when safe instead of making the person design the solution for you.
- For an existing Plot ref, read its current structure, theme, relevant comments, and human-authored notes before changing it. Preserve strong work and continue its visual language.
- Use `resource_find` and `resource_get` only when a template, theme, workflow, or capability detail is needed. The MCP server is the source of truth for current tools and schemas; do not load the complete catalog by default.

## Search assets before creating substitutes

Before drawing or generating a logo, icon, illustration, photo, font, or other brand material:

1. Search the workspace library for project-specific assets and the shared library for organization-wide assets. Use a focused semantic query and the relevant kind.
2. Inspect candidate metadata and preview visual candidates with `asset_get`; do not choose solely by filename.
3. Attach the chosen immutable revision with `asset_attach` and use its stable `/assets/...` path.

Prefer a suitable existing asset over generating a new one. Never reconstruct an available official logo with text, CSS shapes, or a generated imitation. If no official mark is available, use a neutral text treatment or ask for the source when the mark is important; do not present an invented emblem as official. Preserve authored SVG bytes.

## Author the right form

- Choose the form that fits the request: single screen, routed prototype, spatial CanvasDoc, diagram, report, or imported artifact.
- Select one relevant template/theme/workflow when useful; avoid mixing unrelated aesthetics.
- Make the first pass substantive: clear hierarchy, realistic content, working interactions, responsive behavior, accessible labels/contrast/focus, and the relevant loading, empty, error, success, disabled, validation, and overflow states.
- Treat workspace brand and semantic theme as constraints without turning every result into the same dashboard. Avoid generic card grids, gratuitous gradients, weak typography, decorative filler, and duplicated device chrome.
- Inline HTML and a local drafting scratchpad are both valid. Judge the saved Plot result, and avoid leaving unnecessary temporary files in the user’s repository.

For one simple lifecycle action or focused edit, use the direct canvas tool. For work that needs several reads, asset comparison, transformations, drawing/layout helpers, or coordinated changes, use `execute` with `scope:{kind:"canvas",ref}`. Inside the run, read bounded state/files, search and inspect assets, stage document/file/attachment changes, inspect `canvas.diff()`, request `canvas.preview()` when visual evidence is needed, and call `canvas.commit()` exactly once. An exception before commit persists no canvas change. A returned revision conflict means reread and recompute; it must not overwrite newer work.

Attaching an existing immutable asset is part of canvas staging. Importing or generating a new asset through an allowed subject tool is an independent durable effect and is not rolled back if the later canvas commit conflicts. Inspect the execute job’s canvas commit and independent effects separately. Put ordinary data in code literals or read it from the scoped SDK; there is no separate injected input payload.

## Iterate from evidence

- Prefer focused edits and patches for local changes. Keep stable refs and observe revision/hash guards.
- After a meaningful visual change, snapshot the smallest changed target and inspect the actual output. Fix clipping, overlap, overflow, broken assets, unreadable text, and non-working states before declaring it ready.
- Staged visual preview is a target capability, not something to pretend exists. In the current phase, commit first, follow the returned `canvas_snapshot` arguments, then make any correction in a new guarded run.
- Keep refinement bounded to observed defects or a concrete hypothesis. When the remaining choice is subjective, show the strongest direction and name the meaningful alternative.

For ambiguous side effects or recovery after an unknown outcome, read [side effects and approval](../../references/side-effects-and-approval.md) and [recovery](../../references/recovery.md).

## Handoff

Give the person the canonical Plot URL, a concise description of what changed and why, real warnings or limitations, and the next meaningful choice. Do not bury the result under tool logs or internal metadata.
