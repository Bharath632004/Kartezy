# @kartezy/theme

Shared theme library for Kartezy applications.

## Purpose

Provides centralized theming, design tokens, and UI component styling shared across all Kartezy applications.

## Features

- Design token definitions (colors, typography, spacing)
- Light/dark theme support
- Brand guidelines implementation
- Responsive breakpoints
- Animation constants
- Component theme overrides

## Usage

```dart
// Flutter
import 'package:kartezy_theme/kartezy_theme.dart';

MaterialApp(
  theme: KartezyTheme.light,
  darkTheme: KartezyTheme.dark,
);
```

```typescript
// Node.js / Next.js
import { KartezyTheme } from '@kartezy/theme';

const theme = isDark ? KartezyTheme.dark : KartezyTheme.light;
```

## Dependencies

- MUI Theme (admin-dashboard)
- Flutter Material Theme (mobile apps)
