# @kartezy/storage

Shared storage library for Kartezy applications.

## Purpose

Provides local data persistence, caching, and state management utilities shared across all Kartezy applications.

## Features

- Key-value storage
- Secure storage wrapper
- File storage
- Cache management with TTL
- SQLite/local database helpers
- Preference management

## Usage

```dart
// Flutter
import 'package:kartezy_storage/kartezy_storage.dart';

await Storage.set('user_token', jwtToken);
final token = await Storage.get('user_token');
await Storage.remove('user_token');
```

```typescript
// Node.js / Next.js
import { Storage } from '@kartezy/storage';

Storage.set('theme', 'dark');
const theme = Storage.get('theme');
```

## Dependencies

- SharedPreferences (Flutter) / localStorage (Web)
- flutter_secure_storage
