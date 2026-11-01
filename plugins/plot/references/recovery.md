# Recovery and reconciliation

Preserve the refs, content hashes, revisions and idempotency keys Plot returns. A failed call throws `PlotOperationError {code, message, recovery}`; `recovery` names the next call.

- `READ_CONFLICT` / `READ_REQUIRED`: reread the affected state, preserve intervening human work, reapply only the still-valid change with a new `idempotency_key`. `EDIT_ALREADY_APPLIED` means the edit is in: send only what is missing. `OLD_STRING_NOT_FOUND` / `FILE_CHANGED`: reread, redo.
- `DIRTY_SOURCE`: fix the files named in the diagnostics with `plot.files.apply`, or drop the draft with `plot.objects.restore_version({source, to:"accepted", idempotency_key})`. While the head is such a draft, `plot.objects.open` returns `accepted_source` for reading the accepted files. `SOURCE_BUSY`: retry with a new key. `INVALID_INPUT`, `RESOURCE_LIMIT`: fix the named field.
- `STALE_EXECUTOR` / `LEASE_EXPIRED`: start a new `execute`, and read `plot.receipts.get` before repeating a write.
- A run stopped at `timeout_ms` names what landed: read `commits` and `effects`, and `emit` progress so the next stop shows how far it got. Timeout or `OUTCOME_UNKNOWN`: read `error.applied` and `commits` first. Then repeat the `execute` with the same `idempotency_key` to read its result, or read it without a VM: `lookup({method:"receipts.get", input:{kind:"run", idempotency_key}})`. A failed run is final: a new attempt needs a new key.
- Long work returns tasks: `plot.tasks.wait` (`wait_ms` bounds the wait, not the work), `plot.tasks.get` to look, `plot.tasks.reconcile` when the outcome is uncertain. Truncated output is read with `plot.artifacts.read`.
- Never convert an unknown paid dispatch into a new creative attempt merely to force progress.
- Prefer focused repairs to full regeneration. If the current result or evidence cannot be read, state what is unknown rather than self-certifying success.
