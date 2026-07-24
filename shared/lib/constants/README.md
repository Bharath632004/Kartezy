# @kartezy/constants

Shared constants library for Kartezy applications.

## Purpose

Provides centralized constant definitions, enums, and configuration values shared across all Kartezy applications.

## Features

- API endpoint constants
- App-wide configuration values
- Shared enums (order status, payment methods, etc.)
- Environment variable keys
- Error codes

## Usage

```dart
// Flutter
import 'package:kartezy_constants/kartezy_constants.dart';

if (status == OrderStatus.delivered) { ... }
```

```typescript
// Node.js / Next.js
import { API_ENDPOINTS, OrderStatus } from '@kartezy/constants';
```
