# @kartezy/logging

Shared logging library for Kartezy applications.

## Purpose

Provides structured logging, error tracking, and observability capabilities shared across all Kartezy applications.

## Features

- Structured JSON logging
- Log levels (debug, info, warn, error)
- Remote log aggregation
- Error boundary integration
- Performance logging

## Usage

```dart
// Flutter
import 'package:kartezy_logging/kartezy_logging.dart';

Logger.logInfo('Order created', {'orderId': '12345'});
Logger.logError('Payment failed', error, stackTrace);
```

```typescript
// Node.js / Next.js
import { Logger } from '@kartezy/logging';

Logger.info('Order created', { orderId: '12345' });
Logger.error('Payment failed', error);
```
