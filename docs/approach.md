# Approach

This repository is designed to test a focused-context workflow.

## 1. Keep durable context close to the code

The repository contains:

- `service-contracts.md`
- `database-rules.md`
- `known-issues.md`

These files provide stable facts the coding agent should not have to guess.

## 2. Give the agent one bounded intent

The requested change lives in `intent/feature.md`.

The intent defines:

- outcome
- inputs
- outputs
- constraints / boundaries
- success criteria

It does not prescribe implementation details that are not genuine requirements.

## 3. Let the repository guide implementation

The agent should inspect the existing source and tests and use the smallest suitable change.

## 4. Prove the result

The implementation is not complete until automated tests demonstrate the required behavior.

`docs/evidence.md` should be updated with actual results after implementation.

## 5. Record lessons only after evidence exists

`docs/lessons-learned.md` should describe what the experiment actually showed, not what we hoped it would show.
