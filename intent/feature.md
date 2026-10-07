# Intent: Add Payment Retry Validation

## Outcome

Update the existing payment service so it correctly determines whether a failed payment may be retried.

## Inputs

- Existing payment service and public API
- `service-contracts.md`
- `database-rules.md`
- `known-issues.md`
- Existing automated tests

## Outputs

- Retry validation behavior added to the existing payment flow
- Tests updated or added only where required for this behavior
- Existing public API contract preserved
- Actual implementation evidence recorded in `docs/evidence.md`

## Constraints / Boundaries

- Do not change the public API contract
- Do not redesign unrelated payment logic
- Follow existing repository patterns where they are suitable
- Keep the implementation as small as practical
- Do not introduce a real database

A payment must not be retried when:

- it has already succeeded
- the previous failure is permanent
- the configured retry limit has been reached

A payment may be retried when:

- the previous failure is transient
- the payment remains eligible for retry
- the retry limit has not been reached

The implementer owns the technical solution.

## Success Criteria

Demonstrate through automated tests that:

1. transient failures can retry while below the retry limit
2. permanent failures cannot retry
3. successful payments cannot retry
4. payments at the retry limit cannot retry
5. existing public API behavior remains compatible
6. all repository tests pass

The running browser UI should make the retry decision observable to a human reviewer.
