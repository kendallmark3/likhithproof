# Database Rules

This demo uses an in-memory store so the repository stays small and requires no external database.

Treat the in-memory records as if they were persisted payment records.

## Payment Record

Each payment contains:

- `id`
- `amount`
- `status`
- `failureType`
- `retryCount`
- `retryLimit`

## Allowed Status Values

- `succeeded`
- `failed`

## Failure Type

For failed payments:

- `transient` means the failure may be retryable
- `permanent` means the failure must not be retried

For successful payments:

- `failureType` is `null`

## Retry Count

`retryCount` starts at `0`.

Each accepted retry increments the value by exactly `1`.

Rejected retries must not change `retryCount`.

## Retry Limit

The default retry limit is `3`.

A payment whose `retryCount` is already equal to its `retryLimit` is not retryable.

## Scope Boundary

Do not introduce a real database for this exercise.

The persistence model is intentionally simulated so the experiment stays focused on retry validation and evidence.
