# Recovery and reconciliation

Preserve stable refs, content hashes, draft revisions, and idempotency keys returned by Plot.

- On a revision or hash conflict (`file_changed`, `revision_conflict`, `read_required`, `read_conflict`), reread the affected state, preserve intervening human work, and reapply only the still-valid change. `edit_already_applied` means the edit is already in: send only what is missing.
- Follow the `recovery.kind` of an error: `refresh_then_recompute` (reread, then redo), `fix_input` (correct the named field or `/code`; `EXECUTE_REJECTED`: the host refused the run or its commit, nothing was written), `retry_later` (same call in a few seconds), `repeat_same_operation`, `inspect_result` and `inspect_job` (read the state or the job before anything else). A failed `execute` keeps its job and commit receipt in `error.job`; a rejected `canvas_save` keeps its text, so resend only the fix with `resume_id`.
- On a timeout or unknown outcome, reconcile with the relevant read/status tool before retrying. Reuse the same idempotency key for the same logical attempt.
- Never convert an unknown paid dispatch into a new creative attempt merely to force progress.
- Prefer focused repairs to full regeneration. If the current result or evidence cannot be read, state what is unknown rather than self-certifying success.
