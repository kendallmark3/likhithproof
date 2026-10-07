# Service Contracts

This file describes the public contract of the payment service.

The implementation may change internally, but the contract below must remain compatible.

## POST /api/payments

Creates a payment.

### Request

```json
{
  "amount": 42.50,
  "failureType": "transient"
}
```

`failureType` is optional.

Allowed values when supplied:

- `transient`
- `permanent`

### Response

HTTP `201`

```json
{
  "id": "payment-id",
  "amount": 42.5,
  "status": "failed",
  "failureType": "transient",
  "retryCount": 0,
  "retryLimit": 3
}
```

A payment created without `failureType` is treated as successful.

## GET /api/payments/:id

Returns the current payment state.

### Response

HTTP `200`

```json
{
  "id": "payment-id",
  "amount": 42.5,
  "status": "failed",
  "failureType": "transient",
  "retryCount": 0,
  "retryLimit": 3
}
```

Unknown payment IDs return HTTP `404`.

## POST /api/payments/:id/retry

Attempts to retry an existing payment.

### Successful retry

HTTP `200`

```json
{
  "allowed": true,
  "reason": "retry-allowed",
  "payment": {
    "id": "payment-id",
    "amount": 42.5,
    "status": "failed",
    "failureType": "transient",
    "retryCount": 1,
    "retryLimit": 3
  }
}
```

### Rejected retry

HTTP `409`

```json
{
  "allowed": false,
  "reason": "reason-code",
  "payment": {
    "id": "payment-id",
    "amount": 42.5,
    "status": "failed",
    "failureType": "permanent",
    "retryCount": 0,
    "retryLimit": 3
  }
}
```

The response shape must remain unchanged.

Unknown payment IDs return HTTP `404`.

## Compatibility Rule

The task may refine retry eligibility.

It must not:

- rename endpoints
- change HTTP methods
- change request shape
- remove response fields
- rename response fields
- change the success/rejection response structure
