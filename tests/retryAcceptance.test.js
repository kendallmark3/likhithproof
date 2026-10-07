const test = require("node:test");
const assert = require("node:assert/strict");
const store = require("../src/store");
const paymentService = require("../src/paymentService");

test.beforeEach(() => store.clear());

test("transient failure may retry below the retry limit", () => {
  const payment = paymentService.createPayment({
    amount: 42.5,
    failureType: "transient",
  });

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "retry-allowed");
  assert.equal(result.payment.retryCount, 1);
});

test("permanent failure must not retry", () => {
  const payment = paymentService.createPayment({
    amount: 42.5,
    failureType: "permanent",
  });

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "permanent-failure");
  assert.equal(result.payment.retryCount, 0);
});

test("successful payment must not retry", () => {
  const payment = paymentService.createPayment({ amount: 42.5 });

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "already-succeeded");
  assert.equal(result.payment.retryCount, 0);
});

test("payment at the retry limit must not retry", () => {
  const payment = paymentService.createPayment({
    amount: 42.5,
    failureType: "transient",
  });

  payment.retryCount = payment.retryLimit;
  store.save(payment);

  const result = paymentService.retryPayment(payment.id);

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "retry-limit-reached");
  assert.equal(result.payment.retryCount, 3);
});
