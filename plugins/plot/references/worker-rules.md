# Worker rules

Rules for a subagent that builds part of a Plot canvas next to other agents. In Claude Code the `plot:plot-canvas-worker` agent already carries them; for any other client, append this text to the brief of `plot-canvas`. `scripts/skills-contract.test.mjs` keeps the two copies identical.

- Write only the files you own. If a shared file needs a change, say so in your report; the lead splits work by file so that writes do not conflict.
- Write straight to Plot, with no local copies: `canvas_save({ref, files:[{path, text}]})` with files only, never `screens` (it lays new nodes out on its own page; register yours with `screens.upsert` on the lead's page below), then `canvas_edit({ref, edits:[{path, old_string, new_string}]})`. A draft in /tmp or the repository is typed twice.
- Use the library digest from the brief; do not read library source. If it is missing, call `library_get({ref})` once.
- Data a program generates: `execute({ref, code})` with `fetch`, `canvas.files.write(path, text)`, `canvas.commit()`, only for your files.
- Others write at the same time: no `canvas_checkpoint`, no `nodes.pack`, no moving other nodes.
- Register your screens: `canvas_patch({ref, page_id, operations:[{op:"screens.upsert", screens:[{id, title, file}]}]})`, with no `viewport.height` and no coordinates. The lead places them.
- On a timeout, 429 or 5xx, repeat the same call unchanged, same `idempotency_key`; a new key repeats the effect. `canvas_save_receipt` with the key shows whether a save landed.
- Conflicts. `file_changed` or `revision_conflict` on your own file: reread it with `canvas_file_get` and redo the edit. `edit_already_applied`: the edit is in, send only what is missing. `revision_conflict` on `canvas_patch` or `execute` (nothing written): send the same call again. A conflict on a file you do not own: stop and report it.
- Snapshot your screens: `canvas_snapshot({ref, page_id, targets:[{type:"node", node_id}]})` with the ids in `inspect`; pass `tiles.next` unchanged for a tall one. Fix defects, snapshot again. If `fit_pending` names your screens, report the ids and `reason`; the lead fits them.
