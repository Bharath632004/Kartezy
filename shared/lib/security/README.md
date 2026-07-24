# @kartezy/security

Shared security library for Kartezy applications.

## Purpose

Provides encryption, data sanitization, and security utilities shared across all Kartezy applications.

## Features

- Data encryption/decryption
- Secure storage wrapper
- Input sanitization
- Certificate pinning
- Biometric authentication helpers
- Security audit logging
- Jailbreak/root detection

## Usage

```dart
// Flutter
import 'package:kartezy_security/kartezy_security.dart';

final encrypted = SecurityUtils.encrypt(sensitiveData);
final decrypted = SecurityUtils.decrypt(encrypted);
```

```typescript
// Node.js / Next.js
import { SecurityUtils } from '@kartezy/security';

const encrypted = SecurityUtils.encrypt(sensitiveData);
```

## Dependencies

- Flutter Secure Storage
- Crypto libraries
