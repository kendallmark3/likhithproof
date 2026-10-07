const output = document.getElementById("output");
const createBtn = document.getElementById("createBtn");
const retryBtn = document.getElementById("retryBtn");
const amount = document.getElementById("amount");
const failureType = document.getElementById("failureType");

let currentPaymentId = null;

function show(value) {
  output.textContent = JSON.stringify(value, null, 2);
}

createBtn.addEventListener("click", async () => {
  const payload = { amount: Number(amount.value) };
  if (failureType.value) payload.failureType = failureType.value;

  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  show({ httpStatus: response.status, body: data });

  currentPaymentId = data.id || null;
  retryBtn.disabled = !currentPaymentId;
});

retryBtn.addEventListener("click", async () => {
  const response = await fetch(`/api/payments/${currentPaymentId}/retry`, {
    method: "POST",
  });

  const data = await response.json();
  show({ httpStatus: response.status, body: data });
});
