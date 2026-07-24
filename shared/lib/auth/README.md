# @kartezy/auth

Shared authentication library for Kartezy applications.

## Purpose

Provides cross-cutting authentication, authorization, and session management shared across customer, merchant, and delivery applications.

## Features

- JWT token management
- Session handling
- Role-based access control
- OAuth/Social login helpers
- Token refresh logic

## Usage

```dart
// Flutter
import 'package:kartezy_auth/kartezy_auth.dart';

final auth = AuthManager();
await auth.loginWithToken(jwtToken);
```

```typescript
// Node.js / Next.js
import { AuthManager } from '@kartezy/auth';

const auth = new AuthManager();
await auth.refreshToken();
```

## Dependencies

- Secure storage for tokens
- Network client for auth API calls
