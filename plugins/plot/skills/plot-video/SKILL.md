---
name: plot-video
description: Produce or revise videos, timed scenes, character performances, voice, sound, and renders in Plot Video Studio and Character Studio. Use when motion, timing, acting, editing, or audio is central; pair with plot-canvas when interface frames or canvas artifacts are inputs.
---

# Plot Video

Own the whole timed-media result: story, image, motion, character continuity, sound, exact render evidence, and a clear human decision point. The only Plot tool is `execute`: TypeScript in a VM calling `plot.<namespace>.<method>(input)`. Signatures and schemas live in `plot.help({topic})` and the server instructions, and they win over this skill. If unsure of a method, run `plot.help({topic:"catalog"})` or `plot.help({topic:"scene"})` first.

## Model

- A project has one master (script and timeline in the master language) and one variant per other language. Structure (scenes, shots, visuals) lives once on the master; a variant overrides narration, on-screen and caption text, voice clips and timing. Retime a variant; a translation does not keep the master's rhythm.
- Open the video target with an explicit `{language, format, cut}` through `plot.objects.open` and keep the returned session and source. Each tuple has its own evidence and delivery. Read current source, brand, brief and pinned asset, character and font revisions with `plot.objects.read` and `plot.files.read` before changing anything.
- Direct authoring is the default: current user instructions control the work. Requests and proposals (`plot.requests.read`, `plot.requests.transition`, `plot.proposals.submit`, `plot.proposals.preview`, `plot.proposals.decide`) are optional collaboration, used when the user or an open request asks. Notes and comments (`plot.comments.write`) inform; they never change documents or approve.

## Author

- Scenes and soundtrack: `plot.scene.create`, `plot.scene.update`, `plot.scene.reorder`, `plot.scene.remove`, `plot.audio.place`, `plot.audio.remove`. Other typed edits go through `plot.edit.apply` after reading its schema and hash guards (`plot.help({topic:"edit.apply"})`). Keep stable scene and clip ids. On `READ_CONFLICT`, re-read and recompute the edit; never just refresh a hash and replay a conflicting creative change.
- Timeline owns time, order, languages, cuts and the soundtrack. Remotion TSX owns visuals only: no embedded `Audio`, use `useVideoConfig()` for dimensions. A camera or layout rewrite keeps asset identities and audio bindings and is not a reason to regenerate voice. Exact text, captions, UI and controlled motion belong in TSX; use generated imagery for keyframes and worlds. See [video workflow](../../references/video-workflow.md) for TSX files, sound and previews.
- Search before generating: `plot.assets.find`, `plot.assets.read`, `plot.assets.import`. Reuse approved logos, characters, backgrounds, music and effects, listen to audio candidates, and never approximate an available official mark. Tags are not rights or approval. `plot.assets.bind` exposes existing assets to the VM; `plot.assets.register` registers files the VM produced.
- Character Studio sources use the same objects, files and edit methods; see `plot.characters.inspect`, `plot.characters.compile` and `plot.help({topic:"characters"})`. Keep identity, proportions, costume, screen direction and pose language consistent across shots.

## Paid media

- `plot.media.capabilities` lists models, inputs and limits; `plot.media.generate` creates images, voice, music and effects as candidates; `plot.media.transform` handles edits and `kind:"critique"`. Generation never places audio: place the exact revision with `plot.audio.place`.
- Every paid job carries an `idempotency_key`. An unknown outcome (timeout, `OUTCOME_UNKNOWN`) is read back by repeating the same call with the same key, or through `plot.tasks.get`, `plot.tasks.wait`, `plot.tasks.reconcile` and `plot.receipts.get`. Never resubmit under a new key; a different prompt, reference or model is a new attempt, and models are never swapped silently after a failure.
- Verify names, numbers and pronunciation per language and the actual alignment. Never synthesize a voice without consent or rights. Music prompts describe mood, genre, tempo and instruments, not artists. Keep credentials server-side.

## Preview, render, approval

- Observe exact bytes before judging: `plot.inspect` for technical facts, `plot.preview` for frames, ranges and audio, `plot.compare` for two pinned sources. A poster or contact sheet certifies only its samples, not continuity, sync or pacing. Preview is async; follow the task.
- Before render approval, preview the exact candidate. For a final, open the immutable target named by the preview evidence `snapshot_id` and pass that source to `plot.deliveries.render`; follow its original task. Preview and final must agree on source, dependency, runtime and audio pins. A saved source, a finished process or a render receipt is not proof of an MP4 with sound.
- `plot.deliveries.check` is a technical check, not aesthetic approval. `plot.media.transform` with `kind:"critique"` is a paid independent evaluation, not approval and not proof that you watched the video; state what was actually inspected.
- Keep states distinct: asset exists; candidate chosen; edit or proposal accepted; render technically valid; exact MP4 approved; exported; publication recorded. `plot.deliveries.approve` only for the exact version, variant and MP4 hash someone actually assessed, with a truthful `confirmed_viewed`; each language and cut is approved on its own. `plot.deliveries.export` produces separate output (ProRes is separate evidence from an MP4 proxy).
- `plot.deliveries.record` documents an external publication of an exactly approved MP4. It posts nothing and creates no public share. Record only when asked.
- Version pin or baseline: `plot.objects.checkpoint`. Moving, archiving, restoring a project: `plot.objects.move`, `plot.objects.archive`, `plot.objects.restore`; read `plot.help({topic:"objects"})` and inspect each result.

For recovery after an unknown outcome and side effects, read [recovery](../../references/recovery.md) and [side effects and approval](../../references/side-effects-and-approval.md).

## Handoff

Report project, language, format and cut, source and task refs, preview evidence, render hash, review link, creative intent, unresolved findings and the next human decision. Never imply approval, acceptance or publication that did not happen.
