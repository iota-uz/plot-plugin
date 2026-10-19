---
name: plot-video
description: Produce or revise videos, timed scenes, character performances, voice, sound, and renders in Plot Video Studio and Character Studio. Use when motion, timing, acting, editing, or audio is central; pair with plot-canvas when interface frames or canvas artifacts are inputs.
---

# Plot Video

Own the complete timed-media result: story, image, motion, character continuity, sound, render evidence, and a clear human decision point. The Plot MCP server is the source of truth: its server instructions, tool schemas (`plot://tools/<name>`) and recovery hints win over this skill when they differ. Use `resource_find` and `resource_get` for workflow, capability, provider and format details (motion guide: `video://motion/guide`).

## The model: requests, proposals, human Accept

- A project has one **master** (script and timeline in its master language) and one **variant** per other language. Structure (scenes, shots, clips, visuals) lives once on the master; a variant overrides only narration, on-screen and caption text, voice clips and timing. Retime a variant rather than assuming a translation keeps the rhythm.
- Agents never write script, timeline or variant documents directly. Work arrives as **requests** a human opens on a project, scene, shot, clip or render moment (or on a Character Studio), each with a policy (`max_rounds`, `allow_paid`). Every document change is a **proposal** answering a request; nothing changes until a human accepts it.
- Loop: `video_request_list` (default state `open`) → `video_request_claim` the one you will do → `video_request_get` (ask, anchor, conversation, past decisions, base revisions, ready context arguments) → read `video_script_get`, `video_timeline_get`, `video_variant_get` and `video_context_get`, noting the revisions you read → produce → preview and evidence → `video_proposal_submit` → `video_thread_reply` with what you did and what to look at → wait for the human. Do not start another round on your own.
- A new project (`video_project_create`) starts empty; its first content also arrives as a proposal, so ask the human to open a request on it. Reconcile a create with an unknown outcome through `video_receipt_get` and the same idempotency key; follow any other job with `job_get`.
- When blocked (paid work not allowed, missing input, out of scope), `video_request_release` with a reason the human reads; it spends no round. `video_thread_create` leaves a note; notes inform, they never change documents or approve.
- A Character Studio request is read with `character_studio_get` and answered with `character_proposal_submit` (keyed JSON Patch against the read revision); new drawings and poses land as drafts the human accepts.

## Write a proposal

- `changes[]` holds one entry per stream: `document` (`"script"` or `"timeline"`), `language` (null for the master, a language for that variant's overrides), the `base_revision` you read and, for a variant, `base_master_revision`. Operations are keyed JSON Patch by stable ids (`/scenesById/<id>/...`, `/tracksById/<t>/clipsById/<c>/...`); use the canonical names reads return. Add a human `summary` and a creative `hypothesis`.
- `STALE_BASE` means someone edited the same ids, the motion library moved, or the base is too far back: call `video_request_get` again, reread and recompute the operations. Never refresh only the base revision. On Accept the server rebases non-overlapping edits; an overlap returns the request to `open` without spending a round. Claim it again and redo the round.

## Search visual and audio assets first

Search workspace and shared libraries (`asset_list`, `asset_get`) before generating or importing media. Inspect metadata and previews, choose an immutable revision, and reuse approved logos, character assets, backgrounds, product imagery, clips, music, ambience and sound effects. Decide each layer's role first (what should the audience understand, feel or notice), then compare a small set visually and listen to audio candidates for pacing, tone, usable duration and speech compatibility. Tags describe candidates; they do not verify approval, origin or usage rights. Never generate or approximate a replacement for an available official mark, and keep invented demo material distinct from supplied facts. Bring outside media in with `asset_import`.

## Produce only what the shot needs

- Choose the method per shot: motion clips for exact text, captions, layout, UI and controlled motion; `image_generate`/`image_edit` for keyframes and worlds; `video_shot_generate` only when real motion adds meaning; Character Studio movements (`character_movement_list`, `character_movement_get`) for recurring identity and acting.
- **Motion library.** Custom motion is a TSX module in the project's motion library. `video_motion_library_get` returns its revision and declared modules with props; `video_motion_shell` edits it (`expected_revision`) and runs `plot motion check|frame|preview`. A module enters the video only as a timeline clip `source: {kind:"motion", module, props}` placed through a proposal; such proposals carry `base_library_revision`, and a library edit after submit makes them stale, so submit after your last library edit. People see clip previews and props forms, never module source: do not show TSX, diffs or file paths to the user.
- Pass `request_id` to producers (`image_generate`, `image_edit`, `voice_generate`, `video_shot_generate`, `video_render`, `video_critique`) and to `video_motion_shell` when the work serves a request you claimed. Generated media is a candidate; it reaches the timeline only through an accepted proposal.
- Maintain character continuity across shots: identity, proportions, costume, screen direction, scale, lighting, pose language and emotional arc.
- Use `execute` with a `workspace` (id or slug) for loops and several related reads or jobs. It is composition, not a transaction: each operation keeps its own permission checks, idempotency and receipt. A failed run is a tool error whose `error.job` names the job; follow `recovery`.

## Design sound with the picture

- Decide whether the piece needs voice, music, ambience, effects or intentional silence, and what each contributes. Search approved audio first.
- Choose voice (`voice_generate`) for language, character, pace and rights; verify names, numbers and domain terms, and check each language's pronunciation and actual alignment. Never synthesize a voice without consent or rights.
- Align dialogue, pauses, captions, actions and cuts to real timing. Give layers intentional entrances, exits and fades; avoid accidental silence, clipping, loudness jumps and truncated endings.

## Preview, render and evidence

- `video_proposal_preview` (the request, one language, the same `changes`; `expected_library_revision` with motion clips) builds a version of what Accept would produce. It never moves the draft or the language's current version and is never approvable. Render it with `video_render` (`version_id`, `request_id`), then submit with `preview_version_id` and any `evidence_ids`. An evidence id is not a job id: it is `result.evidenceId` from `job_get` of a `video_render` submitted with `rubricHash` and `rubricPolicy` (from `execute` `tools.video_rubric_resolve`) or of a `video_critique`. Plain renders, `video_qa` and `video_frames` register none; a proposal without evidence is valid.
- Watch the exact rendered bytes with sound: `video_inspect` for technical facts, `video_frames` for frames, `video_qa` for checks. A poster or contact sheet cannot establish continuity, audio sync or pacing. `video_critique` is a paid independent evaluation, not approval.
- `video_checkpoint` pins the current documents of one language into a version (for example a baseline before a change); it does not render or approve.

## Cost, approval and publication boundaries

- Paid producers need `allowPaid: true` and the `request_id` of a claimed request whose policy has `allow_paid` on; without one they are refused (`REQUEST_REQUIRED`, `PAID_NOT_ALLOWED`), also inside `execute`. If paid work is needed and not allowed, release the request with the reason. Never hide a paid fallback or replay an unknown paid dispatch under a new idempotency key.
- Keep these states distinct: an asset exists; you chose a candidate; a proposal was accepted (approval of the change, not of a render); a render is technically valid; a human approved the exact MP4 in Video Studio; publication occurred. Only a human accepts proposals and approves renders; each language's render is approved on its own. Critics, replies and your choice never grant approval, so ask the human.
- `video_publication_record` only documents an external publication of a human-approved exact MP4 (else `APPROVAL_REQUIRED`); it posts nothing. Record one only when asked.

For recovery after an unknown outcome and side effects, read [recovery](../../references/recovery.md) and [side effects and approval](../../references/side-effects-and-approval.md).

## Handoff

Report the project, language, request and proposal, preview version, render hash, review URL, creative hypothesis, evidence, unresolved findings, and the next human decision. Never imply acceptance, approval or publication that did not happen.

For `video_exports_delete`, `video_exports_restore`, `video_projects_move`, export archival/restoration and moving projects between workspaces, read `../../references/video-lifecycle.md`. Preview moves before committing; inspect every batch item.
