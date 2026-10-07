# Evidence: Hypothesis, Test, Observation, Result

This is the one-page summary of the experiment in this repository. The full test output and screenshots are in [docs/evidence.md](docs/evidence.md).

Run on 2026-10-07 with Claude Code on Node v20.20.2.

## Hypothesis

Likhith's claim, as stated in the [README](README.md):

> Keep focused engineering context close to the code, give the AI a narrow task, preserve the public contract, and prove the result with tests.

Stated so it can be tested:

**If a repository keeps focused context files next to the code and gives an AI coding agent one bounded intent, the agent will make a correct, small change that preserves the public API, without a person steering it.**

## Test

**Starting point.** A small payment service with a known bug: a payment that failed permanently could still be retried. The starter ran 11 tests, 10 passing and 1 failing. The failing test was the one for this bug. Starter commit: `c601816`.

**What the agent was given.**

- Three context files: [service-contracts.md](service-contracts.md), [database-rules.md](database-rules.md), [known-issues.md](known-issues.md)
- One intent: [intent/feature.md](intent/feature.md)
- The instruction to read those first, make the smallest practical change, and leave the public API alone

**What the agent was asked to do.** Implement the intent. No further guidance was given while it worked.

**How the result was checked.**

1. The repository's automated tests (`npm test`)
2. Contract tests over real HTTP
3. The demo page in a real browser, with the buttons clicked by a script

## Observation

**The change.** One rule added to one function, `evaluateRetry` in [src/paymentService.js](src/paymentService.js): 4 lines added, 2 removed. One contract test added. Change commit: `ab203d3`.

**The tests.**

| | Before | After |
| --- | --- | --- |
| Tests run | 11 | 12 |
| Passing | 10 | 12 |
| Failing | 1 | 0 |

**The intent's six success criteria.**

| Criterion | Observed |
| --- | --- |
| Transient failures can retry below the limit | Pass (2 tests) |
| Permanent failures cannot retry | Pass (2 tests) |
| Successful payments cannot retry | Pass (2 tests) |
| Payments at the retry limit cannot retry | Pass (2 tests) |
| Public API remains compatible | Pass (3 contract tests) |
| All repository tests pass | Pass (12 of 12) |

**The public API.** `src/server.js` and `src/store.js` were not edited. Endpoints, methods, request shape, and response shape are the same. One new value, `permanent-failure`, appears in the existing `reason` field.

**The browser.** Headless Chrome 154, real button clicks, text read from the page's result panel:

| Outcome chosen | Retry | Page displayed |
| --- | --- | --- |
| Transient failure | 1st to 3rd | 200, `retry-allowed`, count 1, 2, 3 |
| Transient failure | 4th | 409, `retry-limit-reached`, count stays 3 |
| Permanent failure | 1st | 409, `permanent-failure`, count stays 0 |
| Success | 1st | 409, `already-succeeded`, count stays 0 |

![The page rejecting a retry of a permanently failed payment](docs/screenshots/permanent.png)

**Things the context files did not settle.**

- The reason code `permanent-failure` came from a test, not from a context file. `service-contracts.md` shows the field only as `"reason-code"`.
- No file says which reason applies when a payment is both permanent and at its retry limit. The agent chose `permanent-failure`. No test covers it.
- The README said the starter's tests passed. One was failing.

## Result

**The hypothesis held in this run.** The agent made a correct change, kept it small, preserved the public API, and needed no steering. Every success criterion in the intent has a passing test, and the browser shows the same behavior.

**What this run does not show.** It does not show that the context files were the reason. Two things stand in the way:

- **No comparison.** The task was run once, with the context files present. It was never run without them.
- **The task was easy.** A failing test already described the exact expected behavior, and a code comment marked where the fix belonged. An agent with no context files would probably have passed as well.

So the fair reading is: the pattern worked here. Whether the pattern is what made it work is still open.

## Next Test

To close that gap, repeat the task from the starter commit with the three context files, the code comment, and the acceptance test for the new behavior removed, and compare:

| Measure | With context (this run) | Without context |
| --- | --- | --- |
| Tests passing | 12 of 12 | not yet run |
| Source lines changed | 4 added, 2 removed | not yet run |
| Files changed outside the target function | 0 | not yet run |
| Public API preserved | Yes | not yet run |
| Reason code matches `permanent-failure` | Yes | not yet run |

If the run without context does worse, that difference is the evidence for the claim. If it does just as well, the task is too easy to tell, and the experiment needs a harder change.
