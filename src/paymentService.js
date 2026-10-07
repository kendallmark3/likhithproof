const crypto = require("node:crypto");
const store = require("./store");

const DEFAULT_RETRY_LIMIT = 3;

function createPayment({ amount, failureType = null }) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("invalid-amount");
  }

  if (failureType !== null && !["transient", "permanent"].includes(failureType)) {
    throw new Error("invalid-failure-type");
  }

  const payment = {
    id: crypto.randomUUID(),
    amount,
    status: failureType ? "failed" : "succeeded",
    failureType: failureType || null,
    retryCount: 0,
    retryLimit: DEFAULT_RETRY_LIMIT,
  };

  return store.save(payment);
}

function getPayment(id) {
  return store.get(id);
}

function evaluateRetry(payment) {
  if (payment.status === "succeeded") {
    return { allowed: false, reason: "already-succeeded" };
  }

  if (payment.retryCount >= payment.retryLimit) {
    return { allowed: false, reason: "retry-limit-reached" };
  }

  // Known issue KI-001:
  // permanent failures are not yet distinguished from transient failures.
  return { allowed: true, reason: "retry-allowed" };
}

function retryPayment(id) {
  const payment = store.get(id);

  if (!payment) {
    return null;
  }

  const decision = evaluateRetry(payment);

  if (!decision.allowed) {
    return {
      ...decision,
      payment,
    };
  }

  payment.retryCount += 1;
  const saved = store.save(payment);

  return {
    ...decision,
    payment: saved,
  };
}

module.exports = {
  createPayment,
  getPayment,
  evaluateRetry,
  retryPayment,
  DEFAULT_RETRY_LIMIT,
};
