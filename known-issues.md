# Known Issues

## KI-001 — Permanent failures are currently retryable

The starter implementation checks:

- whether the payment already succeeded
- whether the retry limit has been reached

It does **not** currently reject a retry when the previous failure is permanent.

This is the primary change requested by the feature intent.

## KI-002 — Browser UI is intentionally minimal

The UI exists only to make the behavior easy to observe.

Visual polish is not part of this exercise.

## KI-003 — State is reset when the server restarts

The demo uses an in-memory store.

This is intentional and should not be replaced with a database for this challenge.
