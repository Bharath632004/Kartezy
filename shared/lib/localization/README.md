# @kartezy/localization

Shared localization library for Kartezy applications.

## Purpose

Provides internationalization (i18n) and localization support shared across customer, merchant, and delivery applications.

## Features

- Multi-language support
- Translation key management
- RTL layout support
- Number/date formatting
- Pluralization rules

## Usage

```dart
// Flutter
import 'package:kartezy_localization/kartezy_localization.dart';

final t = LocaleManager.instance;
String greeting = t.translate('hello', {'name': 'User'});
```

```typescript
// Node.js / Next.js
import { t } from '@kartezy/localization';

const greeting = t('hello', { name: 'User' });
```

## Supported Languages

- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)
