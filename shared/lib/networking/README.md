# @kartezy/networking

Shared networking library for Kartezy applications.

## Purpose

Provides HTTP client configuration, API interceptors, retry logic, and network utilities shared across all Kartezy applications.

## Features

- HTTP client with interceptors
- Token-based authentication interceptor
- Retry and timeout configuration
- Request/response logging
- Network connectivity monitoring
- Multipart upload support
- SSL pinning

## Usage

```dart
// Flutter
import 'package:kartezy_networking/kartezy_networking.dart';

final client = ApiClient(baseUrl: 'https://api.kartezy.com');
final response = await client.get('/orders/12345');
```

```typescript
// Node.js / Next.js
import { ApiClient } from '@kartezy/networking';

const client = new ApiClient({ baseUrl: 'https://api.kartezy.com' });
const response = await client.get('/orders/12345');
```

## Dependencies

- Dio (Flutter) / Axios (Node.js)
- Connectivity plugins
