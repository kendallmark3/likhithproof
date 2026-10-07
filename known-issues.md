# Known Issues

## KI-001 — Permanent failures were retryable (resolved)

Resolved on 2026-10-07 by the feature intent. A retry of a permanently failed payment is now rejected with the reason `permanent-failure`. See `docs/evidence.md`.

The starter implementation checked only:

- whether the payment already succeeded
- whether the retry limit has been reached

## KI-002 — Browser UI is intentionally minimal

The UI exists only to make the behavior easy to observe.

Visual polish is not part of this exercise.

## KI-003 — State is reset when the server restarts

The demo uses an in-memory store.

This is intentional and should not be replaced with a database for this challenge.
