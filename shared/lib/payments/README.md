# @kartezy/payments

Shared payments library for Kartezy applications.

## Purpose

Provides payment gateway integration, transaction handling, and payment UI components shared across customer and merchant applications.

## Features

- Multiple payment gateway support (Razorpay, Stripe, etc.)
- Payment method management
- Transaction status tracking
- Wallet integration
- UPI/Netbanking/Card support
- Payment retry logic
- Receipt generation

## Usage

```dart
// Flutter
import 'package:kartezy_payments/kartezy_payments.dart';

final payment = PaymentService();
payment.processOrder(
  amount: 299.00,
  orderId: '12345',
  paymentMethod: PaymentMethod.upi,
);
```

```typescript
// Node.js / Next.js
import { PaymentService } from '@kartezy/payments';

const payment = new PaymentService();
await payment.verifyPayment(razorpayPaymentId, orderId);
```

## Dependencies

- Razorpay / Stripe SDK
- UPI gateway plugins
