# Problem

A small payment service can create payments, return payment state, and retry failed payments.

The service already prevents:

- retrying a successful payment
- retrying after the retry limit has been reached

But it currently treats all failed payments the same.

That is incorrect.

A transient processor failure may be retried.

A permanent decline must not be retried.

The engineering problem is deliberately narrow:

> Correct retry eligibility while preserving the public API contract.

This is a brownfield change, not a redesign exercise.
