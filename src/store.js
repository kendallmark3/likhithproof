const payments = new Map();

function save(payment) {
  payments.set(payment.id, structuredClone(payment));
  return get(payment.id);
}

function get(id) {
  const payment = payments.get(id);
  return payment ? structuredClone(payment) : null;
}

function clear() {
  payments.clear();
}

module.exports = { save, get, clear };
