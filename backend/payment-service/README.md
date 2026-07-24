# Payment Service

Payment processing and financial transactions service.

## Features
- COD (Cash on Delivery) payments
- Online payments via Razorpay
- Payment gateway webhook integration (HMAC-SHA256 verified)
- Refunds & partial refunds
- Merchant settlements
- Payment status tracking
- Transaction history

## Tech Stack
- PostgreSQL (payments, refunds, settlements)
- Kafka (payment events)
- Razorpay (payment gateway)

## API
`/api/v1/payments/*` — Payment endpoints  
`/api/v1/webhook/razorpay` — Razorpay webhook callback

## Events Published
- `payment.completed` — Successful payment
- `payment.failed` — Failed payment
- `payment.refunded` — Refund processed

## Security
- Razorpay webhook signature verification (HMAC-SHA256)
- Idempotency key support
- PCI-compliant (cards not stored directly)
