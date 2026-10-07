# Lessons Learned

Status: **Written on 2026-10-07 after the implementation, from the evidence in `docs/evidence.md`.**

This is one run by one coding agent (Claude Code) on a very small repository. There was no comparison run with vague or missing context, so nothing here measures how much the context files helped. It records what happened in this run.

## 1. Did the focused Markdown context reduce ambiguity?

Partly. The files agreed with each other and named the gap exactly: `known-issues.md` KI-001 said which check was missing, and a comment in `evaluateRetry` marked the spot.

Two things the Markdown did not settle:

- The reason code. `service-contracts.md` shows it only as `"reason-code"`. The value `permanent-failure` came from `tests/retryAcceptance.test.js`, not from any context file.
- Which reason wins when a payment is both permanent and at its retry limit. No file or test says. The implementation reports `permanent-failure`.

One statement was wrong: `README.md` said the baseline tests pass. The starter had 1 failing test out of 11.

## 2. Did the coding agent preserve the public API without being reminded during implementation?

Yes. No one intervened during implementation, and `src/server.js` was not edited. The instruction was already in the repository three times (`CLAUDE.md`, `intent/feature.md`, `service-contracts.md`), so this run does not show what would happen without it.

The change does add a new value to the `reason` field. Whether that counts as a contract change depends on whether the allowed reason codes are part of the contract, which `service-contracts.md` leaves open.

## 3. Was the change smaller than it would have been with broad or vague instructions?

Unknown. The change was small: 4 lines added and 2 removed in one function, plus one new test. No run with broad instructions exists to compare against.

## 4. Which repository file had the most influence on the solution?

`tests/retryAcceptance.test.js`. It was already failing on the missing behavior and fixed the exact reason code, so it defined "done" more precisely than any prose file.

Among the Markdown files, `known-issues.md` had the most influence, because KI-001 pointed at the one missing check.

## 5. What did the tests catch that a prose explanation would not have proven?

- That the starter was red before the change, which contradicted the README.
- That a rejected retry leaves the stored `retryCount` at 0, checked by reading the payment back over HTTP.
- That a rejected retry returns 409 with the same response shape. No test covered any rejection over HTTP until one was added for this change.

## 6. What context was unnecessary?

For this change, these were read and not used:

- `docs/problem.md` and `docs/approach.md`, which restate `README.md` and `intent/feature.md`.
- KI-002 and KI-003 in `known-issues.md`.
- The retry rules, which appear in full in `README.md`, `intent/feature.md`, and `database-rules.md`.

The boundary statements (no real database, no redesign) cost little to read. This run cannot show whether they prevented anything.

## 7. What should be changed before repeating the pattern on a larger brownfield repository?

- List the allowed `reason` codes in `service-contracts.md`, so the contract is in the contract file and not only in a test.
- State how rules rank when more than one applies.
- Keep "current state" claims checkable. The README's "baseline tests pass" line was stale on first use; a recorded test run would not have been.
- Run the same intent once without the three context files. Without that, the experiment shows that the pattern worked here, not that the context files were the reason.
- Use a change that touches more than one function. Here the answer was a single `if`, marked by a comment and pinned by a failing test, which most approaches would get right.
