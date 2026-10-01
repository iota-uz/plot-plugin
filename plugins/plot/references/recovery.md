# Recovery and reconciliation

Preserve stable refs, content hashes, draft revisions, and idempotency keys returned by Plot.

- On a revision or hash conflict (`file_changed`, `revision_conflict`, `read_required`, `read_conflict`), reread the affected state, preserve intervening human work, and reapply only the still-valid change. `edit_already_applied` means the edit is already in: send only what is missing.
- Follow the `recovery.kind` of an error: `refresh_then_recompute` (reread, then redo), `fix_input` (correct the named field or `/code`), `retry_later` (same call in a few seconds), `repeat_same_operation`, `inspect_result` and `inspect_job` (read the state or the job before anything else). A failed `execute` keeps its job and commit receipt in `error.job`; a rejected `canvas_save` keeps its text, so resend only the fix with `resume_id`.
- After a fit (`fitted`), `canvas_save` without `doc`, `canvas_edit`, `canvas_patch` and `execute` go on without a reread; a full `doc` written from a read made before the fit gets `read_conflict`: reread first. A `canvas_patch` answering `changed:0` left the document as it was and wrote nothing.
- `execute`: `EXECUTE_REJECTED` carries the host's reason (nothing written, fix the code or input). A run that never started (`EXECUTE_NOT_STARTED`) needs a new `idempotency_key` or none: a repeat with the old key returns the stored failure. A landed commit is never rerun.
- `asset_import` items succeed or fail alone: resend only the failed ones under a new `idempotency_key`, and only those with `retryable:true` (`worker_busy`, `worker_timeout`); a 4xx source or undecodable media is permanent. `path_exists`: another file, or another author's upload, holds the path; choose another `dir` or name. `attach_failed` leaves the asset imported (`asset_ref` in the message): bind it with `asset_attach`.
- Snapshot: a failed capture in `captures[].error` (`target_not_found`, `snapshot_store_timeout`, `batch_deadline`) does not fail the others; ask for that capture again. `worker_outdated` is `retry_later`: the render worker is being redeployed.
- On a timeout or unknown outcome, reconcile with the relevant read/status tool before retrying. Reuse the same idempotency key for the same logical attempt.
- Never convert an unknown paid dispatch into a new creative attempt merely to force progress.
- Prefer focused repairs to full regeneration. If the current result or evidence cannot be read, state what is unknown rather than self-certifying success.
