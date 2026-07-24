# @kartezy/notifications

Shared notifications library for Kartezy applications.

## Purpose

Provides in-app notifications, push notification handling, and notification management shared across customer, merchant, and delivery applications.

## Features

- Push notification registration (FCM)
- Local notification scheduling
- Notification routing/deep linking
- Notification preferences
- Notification history
- Badge count management

## Usage

```dart
// Flutter
import 'package:kartezy_notifications/kartezy_notifications.dart';

NotificationService.initialize();
NotificationService.showLocalNotification(
  title: 'Order Delivered',
  body: 'Your order #12345 has been delivered!',
);
```

```typescript
// Node.js / Next.js
import { NotificationService } from '@kartezy/notifications';

NotificationService.registerDeviceToken(fcmToken);
```

## Dependencies

- Firebase Cloud Messaging
- Local notification plugins
