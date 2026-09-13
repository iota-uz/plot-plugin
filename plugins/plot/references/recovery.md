# Recovery and reconciliation

Preserve stable refs, content hashes, draft revisions, and idempotency keys returned by Plot.

- On a revision or hash conflict, reread the affected state, preserve intervening human work, and reapply only the still-valid change.
- On a timeout or unknown outcome, reconcile with the relevant read/status tool before retrying. Reuse the same idempotency key for the same logical attempt.
- Never convert an unknown paid dispatch into a new creative attempt merely to force progress.
- Prefer focused repairs to full regeneration. If the current result or evidence cannot be read, state what is unknown rather than self-certifying success.
