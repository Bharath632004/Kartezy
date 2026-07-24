# @kartezy/validation

Shared validation library for Kartezy applications.

## Purpose

Provides input validation rules, form validation logic, and data integrity checks shared across all Kartezy applications.

## Features

- Email validation
- Phone number validation (India +91)
- Password strength checker
- Form field validators
- Input sanitization
- Custom validation rules
- Error message templates

## Usage

```dart
// Flutter
import 'package:kartezy_validation/kartezy_validation.dart';

final emailError = Validators.validateEmail(userInput);
final phoneError = Validators.validatePhone(userInput);
final passwordStrength = PasswordValidator.checkStrength(password);
```

```typescript
// Node.js / Next.js
import { Validators, PasswordValidator } from '@kartezy/validation';

const emailError = Validators.validateEmail(userInput);
const passwordStrength = PasswordValidator.checkStrength(password);
```

## Dependencies

- Platform-specific regex utilities
