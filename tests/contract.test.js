const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const store = require("../src/store");
const { handler } = require("../src/server");

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test.beforeEach(() => store.clear());

test("POST /api/payments preserves the public response shape", async () => {
  const response = await fetch(`${baseUrl}/api/payments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amount: 42.5, failureType: "transient" }),
  });

  assert.equal(response.status, 201);
  const body = await response.json();

  for (const key of ["id", "amount", "status", "failureType", "retryCount", "retryLimit"]) {
    assert.ok(Object.hasOwn(body, key), `missing response field: ${key}`);
  }
});

test("POST /api/payments/:id/retry preserves the retry response shape", async () => {
  const create = await fetch(`${baseUrl}/api/payments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amount: 42.5, failureType: "transient" }),
  });

  const payment = await create.json();

  const response = await fetch(`${baseUrl}/api/payments/${payment.id}/retry`, {
    method: "POST",
  });

  assert.equal(response.status, 200);
  const body = await response.json();

  for (const key of ["allowed", "reason", "payment"]) {
    assert.ok(Object.hasOwn(body, key), `missing retry response field: ${key}`);
  }

  for (const key of ["id", "amount", "status", "failureType", "retryCount", "retryLimit"]) {
    assert.ok(Object.hasOwn(body.payment, key), `missing payment field: ${key}`);
  }
});

test("POST /api/payments/:id/retry preserves the rejected retry response shape", async () => {
  const create = await fetch(`${baseUrl}/api/payments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amount: 42.5, failureType: "permanent" }),
  });

  const payment = await create.json();

  const response = await fetch(`${baseUrl}/api/payments/${payment.id}/retry`, {
    method: "POST",
  });

  assert.equal(response.status, 409);
  const body = await response.json();

  for (const key of ["allowed", "reason", "payment"]) {
    assert.ok(Object.hasOwn(body, key), `missing retry response field: ${key}`);
  }

  for (const key of ["id", "amount", "status", "failureType", "retryCount", "retryLimit"]) {
    assert.ok(Object.hasOwn(body.payment, key), `missing payment field: ${key}`);
  }

  const stored = await fetch(`${baseUrl}/api/payments/${payment.id}`);
  assert.equal((await stored.json()).retryCount, 0);
});
