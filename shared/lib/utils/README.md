# @kartezy/utils

Shared utilities library for Kartezy applications.

## Purpose

Provides general-purpose utility functions, helpers, and extensions shared across all Kartezy applications.

## Features

- Date/time formatting and manipulation
- Number and currency formatting
- String utilities (validation, sanitization)
- Collection/array helpers
- Debounce and throttle
- Async utilities
- Extension methods

## Usage

```dart
// Flutter
import 'package:kartezy_utils/kartezy_utils.dart';

final formattedPrice = CurrencyFormatter.format(299.00);
final relativeTime = DateUtils.timeAgo(DateTime.now().subtract(Duration(hours: 2)));
```

```typescript
// Node.js / Next.js
import { CurrencyFormatter, DateUtils } from '@kartezy/utils';

const price = CurrencyFormatter.format(299.00);
const timeAgo = DateUtils.timeAgo(twoHoursAgo);
```
