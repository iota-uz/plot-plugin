---
name: plot-video
description: Produce or revise videos, timed scenes, character performances, voice, sound, and renders in Plot Video Studio and Character Studio. Use when motion, timing, acting, editing, or audio is central; pair with plot-canvas when interface frames or canvas artifacts are inputs.
---

# Plot Video

Own the complete timed-media result: story, image, motion, character continuity, sound, render evidence, and a clear human review point.

## Frame the production

- Establish audience, platform, language, objective, duration, aspect ratio, brand/tone, required facts, and desired viewer action. Do not promise virality or invent facts.
- State one concrete creative hypothesis: why the hook, structure, and visual device should work for this audience.
- Use `resource_find` and `resource_get` only for the relevant workflow, capability, provider, or format details. Treat the MCP server as the dynamic source of truth.

## Search visual and audio assets first

Search both workspace and shared libraries before generating or importing media. Inspect metadata and previews, choose an appropriate immutable revision, and reuse approved logos, character assets, backgrounds, product imagery, clips, music, ambience, and sound effects when available.

Choose the role of each visual and sound layer before filling the timeline: what should the audience understand, feel or notice? Search by subject, mood and production role; compare a small set visually and listen to audio candidates for pacing, tone, usable duration and speech compatibility. Library tags describe candidates; they do not independently verify approval, origin or usage rights. When no suitable asset exists, broaden the query, import/generate with the required approval, or deliberately use silence or a simpler composition. Keep invented demo material distinct from supplied facts.

Never generate or approximate a replacement for an available official mark. Do not claim an invented mark is official when the correct asset is absent. Check the actual content, revision, format, rights, and production role rather than trusting a filename.

## Work through an observable loop

Use this production loop without turning it into ceremony:

brief and context → script → scenes/shots → assets and characters → timeline and sound → checkpoint → draft render → inspect exact bytes → bounded refinement

Use direct tools for one simple operation. Use `execute` with `scope:{kind:"workspace",ref}` when code, loops, parallel reads, or several published asset/video/job operations make the workflow clearer. Workspace-scoped execute is composition, not a platform transaction: every called operation retains its own schema, permission checks, idempotency guard, side-effect semantics, and receipt. Use bounded `emit()` for the IDs and decisions the next step needs, and inspect job/effect receipts after failures. Nested execute is unavailable.

- Choose the production method per shot. Use deterministic composition for precise text, UI, captions, layout, and controlled motion; generated images for keyframes/worlds; generated video only when meaningful motion adds value; Character Studio for recurring identity, acting, staging, and reusable movement.
- Maintain character continuity across shots: identity, proportions, costume/props, screen direction, scale, lighting, pose language, and emotional arc. Check silhouette, surface contacts, joints, intersections, gaze, and whether acting matches the line.
- Treat language versions independently. Verify natural speech, pronunciation, rhythm, reading speed, captions, and alignment for each language.

## Design sound with the picture

- Decide deliberately whether the piece needs voice, music, ambience, effects, or intentional silence, and what each layer contributes.
- Search approved audio assets first. Generate or import only when no suitable asset exists.
- Choose voice for language, character, pace, and usage rights; verify names, numbers, and domain terms.
- Align dialogue, pauses, captions, actions, and cuts to actual timing. Use music and effects for rhythm and emphasis without masking meaning or speech.
- Give layers intentional entrances, exits, fades, and transitions. Avoid accidental silence, abrupt cuts, clipping, loudness jumps, and truncated endings.
- Review the rendered result with sound, checking voice/music/SFX balance, synchronization, and the ending.

## Cost, review, and approval boundaries

- Do not dispatch paid generation without the required `allowPaid` signal and current capability check. Do not conceal a paid fallback or retry an unknown dispatch with a new idempotency key.
- A poster or contact sheet is not evidence of video quality. Watch the exact rendered candidate over time and assess hook, pacing, continuity, transitions, captions, safe zones, audio balance, voice sync, and CTA/ending.
- Share a review URL as soon as the first viable draft exists. Refine from concrete observations or human feedback rather than holding the work in an endless private loop.
- Keep these states distinct: an asset exists; the agent selected a candidate; a render is technically valid; a human approved exact bytes; publication occurred. Publication requires an explicit request.

For recovery after an unknown outcome or details about side effects, read [recovery](../../references/recovery.md) and [side effects and approval](../../references/side-effects-and-approval.md).

## Handoff

Report the project, language, version, render hash, review URL, creative hypothesis, important decisions, unresolved findings, and the next human choice. Never imply human approval or publication unless it actually happened.
