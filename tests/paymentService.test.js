const test = require("node:test");
const assert = require("node:assert/strict");
const store = require("../src/store");
const paymentService = require("../src/paymentService");

test.beforeEach(() => store.clear());

test("creates a successful payment", () => {
  const payment = paymentService.createPayment({ amount: 25 });

  assert.equal(payment.amount, 25);
  assert.equal(payment.status, "succeeded");
  assert.equal(payment.failureType, null);
  assert.equal(payment.retryCount, 0);
  assert.equal(payment.retryLimit, 3);
});

test("creates a failed transient payment", () => {
  const payment = paymentService.createPayment({
    amount: 25,
    failureType: "transient",
  });

  assert.equal(payment.status, "failed");
  assert.equal(payment.failureType, "transient");
});

test("allows a retry for a failed payment below the retry limit", () => {
  const payment = paymentService.createPayment({
    amount: 25,
    failureType: "transient",
  });

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "retry-allowed");
  assert.equal(result.payment.retryCount, 1);
});

test("rejects retry for a successful payment", () => {
  const payment = paymentService.createPayment({ amount: 25 });

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "already-succeeded");
  assert.equal(result.payment.retryCount, 0);
});

test("rejects retry when retry limit is reached", () => {
  const payment = paymentService.createPayment({
    amount: 25,
    failureType: "transient",
  });

  payment.retryCount = payment.retryLimit;
  store.save(payment);

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "retry-limit-reached");
  assert.equal(result.payment.retryCount, 3);
});
