# @kartezy/widgets

Shared widgets and UI components library for Kartezy applications.

## Purpose

Provides reusable UI components, widgets, and design system elements shared across customer, merchant, and delivery applications.

## Features

- Common UI components (buttons, cards, inputs)
- Loading states and skeletons
- Error states
- Empty states
- Bottom sheets and modals
- Toast/snackbar notifications
- App bars and navigation
- Product card widgets
- Order status widgets
- Rating and review widgets

## Usage

```dart
// Flutter
import 'package:kartezy_widgets/kartezy_widgets.dart';

KartezyButton(
  text: 'Add to Cart',
  variant: ButtonVariant.primary,
  onPressed: () {},
);

ProductCard(
  product: product,
  onTap: () => navigateToProduct(product.id),
);
```

```typescript
// Node.js / Next.js
import { KartezyButton, ProductCard } from '@kartezy/widgets';

<KartezyButton variant="primary" onClick={handleAddToCart}>
  Add to Cart
</KartezyButton>
```

## Dependencies

- MUI (admin-dashboard)
- Flutter Material (mobile apps)
