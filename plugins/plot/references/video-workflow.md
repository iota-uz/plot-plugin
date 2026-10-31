# Video workflow details

Judgement only; exact inputs come from `plot.help({topic})`.

## Visual source

- Work in the source tree: visual module files under `/src`, bindings declared in `/plot.motion.ts`. `plot.scene.create` creates the scene, its visual clip and the module binding atomically and takes the first file with `expected_hash: null`; read its schema with `plot.help({topic:"scene.create"})`.
- Use `plot.files.read`, `plot.files.search` and `plot.files.apply` (with `expected_hash` and an `idempotency_key`). Keep generated SVG or path bytes exact; do not retype geometry.
- Use the project's pinned Remotion and SDK versions. No dependency installer runs on the backend: a package outside the pins means asking the owner. `plot.processes.exec` runs the remote Node, Python or bash toolchain; compilation is not render evidence.
- Show users previews and props, not module source, unless asked.

## Sound

- Decide per piece what voice, music, ambience, effects or silence contribute. Bind every sound explicitly in the Timeline. Required voice and required output audio stay required after retimes and cut changes.
- For another language place its voice into the same `{track, clip}` as the master with that language in `audioBinding.language`; the master slot must exist. Use that language's alignment for word anchors. A missing or ambiguous anchor is a diagnostic, not permission to invent timestamps.
- ASR agreement does not prove natural stress or delivery. Reanalyse existing music instead of regenerating it to fix beat data.

## Evidence

- Mark intentional transition motion in the authored module and keep real clipping failures; a typography overhang alone is advisory.
- Evidence names what it covers: frames, range, native audio, technical report or attributed provider critique. JSON is not video perception. If you cannot watch or hear the media, say so and report the exact coverage.
- Independent review: hand exact artifacts, hashes and criteria to the `video-critic` agent without your preferred ranking.
