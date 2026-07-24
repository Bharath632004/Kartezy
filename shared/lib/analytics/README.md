# @kartezy/analytics

Shared analytics library for Kartezy applications.

## Purpose

Provides cross-cutting analytics, event tracking, and telemetry functionality shared across customer, merchant, and delivery applications.

## Features

- Event tracking client
- Screen view tracking
- User property management
- Analytics configuration

## Usage

```dart
// Flutter
import 'package:kartezy_analytics/kartezy_analytics.dart';

Analytics.trackEvent('purchase_completed', {
  'order_id': '12345',
  'amount': 299.00,
});
```

```typescript
// Node.js / Next.js
import { Analytics } from '@kartezy/analytics';

Analytics.trackEvent('page_view', { page: '/home' });
```

## Dependencies

- Platform-specific storage for event queuing
- Network client for sending events
