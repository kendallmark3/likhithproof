# Likhith Payment Retry Proof

A small brownfield coding challenge built around a simple idea:

> Keep focused engineering context close to the code, give the AI a narrow task, preserve the public contract, and prove the result with tests.

This starter repository was inspired by guidance from **Likhith** and expanded during **Intent-Driven Saturdays** into a runnable proof.

The repository is intentionally small. The goal is not to build a payment platform. The goal is to demonstrate whether focused repository context helps an AI coding agent make a correct, bounded change.

## The Challenge

The service already exposes a public payment API.

The next change is narrow:

**Update payment retry validation without changing the public API contract.**

A payment must not be retried when:

- it already succeeded
- the previous failure was permanent
- the retry limit has been reached

A payment may be retried when:

- the previous failure was transient
- the payment remains retryable
- the retry limit has not been reached

The implementation should follow the existing repository style and should not redesign unrelated code.

## Why These Files Exist

Likhith's proposed context pattern is represented directly in this repository:

- `service-contracts.md`
- `database-rules.md`
- `known-issues.md`

The coding agent should reason over those files before changing the implementation.

The implementation intent is in:

- `intent/feature.md`

Supporting documentation is in:

- `docs/problem.md`
- `docs/approach.md`
- `docs/evidence.md`
- `docs/lessons-learned.md`

## Run the Starter

Requirements:

- Node.js 20+

Start the application:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

Run the tests:

```bash
npm test
```

## Current State

The brownfield change has been implemented: retry validation now rejects permanent failures. All 12 tests pass, and the results are recorded in `docs/evidence.md`.

The starter intentionally contained an incomplete retry rule that did **not** distinguish transient failures from permanent failures. It ran 10 passing tests and 1 failing test, the acceptance test for that rule.

The starter is the first commit on `main`, for anyone who wants to repeat the experiment from the beginning.

## Suggested Claude Code Instruction

```text
Reason over this repository before making changes.

Read README.md, service-contracts.md, database-rules.md,
known-issues.md, and intent/feature.md.

Implement the intent with the smallest practical change.
Preserve the public API contract.
Do not redesign unrelated code.

Run all tests and update docs/evidence.md with the actual evidence.
Update docs/lessons-learned.md only after implementation based on what
the repository and test results actually show.
```

## Proof Standard

Do not accept "the code looks right" as proof.

The finished repository should demonstrate:

1. transient failures can retry below the limit
2. permanent failures cannot retry
3. successful payments cannot retry
4. payments at the retry limit cannot retry
5. the existing public API contract remains compatible
6. all automated tests pass

The UI exists so a human can also observe the behavior directly.

## Intent-Driven Saturdays

The experiment is intentionally designed so that somebody can bring an idea and, within a short working session, turn it into:

**Idea → focused context → intent → implementation → tests → evidence**

The repository is the proof.
