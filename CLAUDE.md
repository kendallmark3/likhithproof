# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A deliberately small brownfield exercise from Intent-Driven Saturdays: one bounded change (payment retry validation) made against focused context files, and proved with tests. The repository is the proof; it is not a payment platform and should not grow into one.

It sits inside the `suggestionbox` directory but is a separate project. The Ideas Workbench rules in the parent `CLAUDE.md` (intent files under `templates/intents/`, `IDEAS_FILE`, the admin passcode) do not apply here.

## Before modifying code

1. Read `README.md`.
2. Read `service-contracts.md`.
3. Read `database-rules.md`.
4. Read `known-issues.md`.
5. Read `intent/feature.md`.
6. Inspect the source and tests.

Implement the intent with the smallest practical change.

Do not redesign unrelated code.
Do not change the public API contract.
Do not add infrastructure that the intent does not require (in particular, no real database).

## Workflow plugin

The author's Intent-Driven Starter plugin is installed for the user account and provides the workflow for this exercise.

`intent-driven-starter/` is a clone of its source (v1.0.0, https://github.com/kendallmark3/intent-driven-starter), kept for reference. It is not application code, and editing it does not change behavior: Claude Code runs the installed plugin, not this clone. The plugin itself is under `intent-driven-starter/plugins/intent-driven-starter/`.

- `/intent-driven-starter:start` for repo-aware onboarding before proposing changes.
- `/intent-driven-starter:execute-intent` to implement `intent/feature.md` with its understand → refine → delta → implement → validate → stop discipline.
- `/intent-driven-starter:intent-creator` only if the intent itself needs refining; `intent/feature.md` already exists.

The reading order above still applies when a skill is used.

## Commands

There are no dependencies, so no `npm install` is needed. There is no build step and no linter. Requires Node 20+.

- `npm test` runs every file in `tests/` with the built-in `node:test` runner.
- `node --test tests/retryAcceptance.test.js` runs one file.
- `node --test --test-name-pattern="permanent failure" tests/retryAcceptance.test.js` runs one test by name.
- `npm start` serves the API and the demo page at http://localhost:3000 (`PORT` overrides it). `server.listen` is called without a host, so it listens on every network interface, not only localhost.

## Starting state

`README.md` says the baseline tests pass. They do not: the starter runs 10 passing and 1 failing. The failure is `permanent failure must not retry` in `tests/retryAcceptance.test.js`, which is the acceptance test for the requested change (KI-001). A red run before the change is expected; a red run after it is not.

## Architecture

Three CommonJS modules in `src/`, layered one way:

- `server.js` is a plain `node:http` handler. It serves `public/index.html` and `public/app.js` by explicit route and maps the three API routes onto the service. It exports `handler` and only listens when run directly, which is how `tests/contract.test.js` mounts it on an ephemeral port.
- `paymentService.js` holds every business rule. `evaluateRetry(payment)` is a pure decision function returning `{ allowed, reason }`; `retryPayment(id)` applies it, increments `retryCount` only when allowed, and returns `{ allowed, reason, payment }`. Retry eligibility changes belong in `evaluateRetry`.
- `store.js` is a module-level `Map` standing in for a database. `save` and `get` both return `structuredClone` copies, so mutating a payment object changes nothing until it is passed to `store.save`. Every test file calls `store.clear()` in `beforeEach` because the store is shared across the process.

The server derives the HTTP status from the service result: `allowed` true is 200, false is 409, a `null` result is 404. Errors thrown by `createPayment` (`invalid-amount`, `invalid-failure-type`) become 400 with `{ "error": "<code>" }`. The service therefore must keep returning the same result shape, or the contract breaks without `server.js` being touched.

The browser page is a display of raw API responses and nothing else. It has no logic of its own to update when retry rules change.

## Things that must stay in line

- `service-contracts.md` is the public contract. It shows the rejection reason only as `"reason-code"`; the actual codes are pinned by the tests: `retry-allowed`, `already-succeeded`, `retry-limit-reached`, and `permanent-failure`.
- `database-rules.md` requires that a rejected retry leaves `retryCount` unchanged and an accepted one adds exactly 1. The tests assert `retryCount` on every retry result.
- `tests/contract.test.js` checks field presence over real HTTP; `tests/paymentService.test.js` covers existing behaviour; `tests/retryAcceptance.test.js` is the four retry criteria from `intent/feature.md`. Add or change tests only where the intent's behaviour requires it.
- `known-issues.md` KI-001 and the comment in `evaluateRetry` describe the same gap. Resolving one means updating the other.

## After the tests pass

- Update `docs/evidence.md` with actual test evidence: the real `npm test` output and the checklist, never expected results. The "browser UI demonstrates the behavior" item needs a real run of the page, not an inference from the tests.
- Update `docs/lessons-learned.md` based on what the implementation demonstrated.

Treat passing tests and preserved contracts as evidence, not prose claims.
