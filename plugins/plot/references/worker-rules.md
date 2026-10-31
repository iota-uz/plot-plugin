# Worker rules

Rules for a subagent that builds part of a Plot canvas next to other agents. In Claude Code the `plot:plot-canvas-worker` agent already carries them; for any other client, append this text to the brief of `plot-canvas`. `scripts/skills-contract.test.mjs` keeps the two copies identical.

- Write only the files you own. If a shared file needs a change, say so in your report; the lead splits work by file so that writes do not conflict.
- Write straight to Plot, with no local copies: `plot.files.apply` with `changes` for your paths only, each with the `expected_hash` from `plot.files.read` (null creates) and a fresh `idempotency_key`. A draft in /tmp or the repository is typed twice.
- Use the library summary from the brief; do not read library source. If it is missing, read `plot.objects.read` facets `exports`, `types`, `styles` once.
- Data a program generates: produce it in the `execute` code or with `plot.processes.exec`, then write it with `plot.files.apply`, only for your files.
- Others write at the same time: no `plot.objects.checkpoint`, no pack or move commands in `plot.edit.apply`, no changes to other nodes or to the shared document.
- On a timeout, `OUTCOME_UNKNOWN` or a lost connection, repeat the same `execute` with the same `idempotency_key` or read `plot.receipts.get`; a new key repeats the effect.
- Conflicts. `READ_CONFLICT` or `FILE_CHANGED` on your own file: reread it with `plot.files.read` and redo the edit with a new `idempotency_key`. `EDIT_ALREADY_APPLIED`: the edit is in, send only what is missing. A conflict on a file you do not own: stop and report it. `STALE_EXECUTOR` or `LEASE_EXPIRED`: start a new `execute`.
- Look at your screens: `plot.preview` then `plot.tasks.wait`, and read the commit `diagnostics` for compile errors. Fix defects, preview again.
