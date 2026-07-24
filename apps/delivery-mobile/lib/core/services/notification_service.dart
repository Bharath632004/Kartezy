import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz_data;

/// Represents a delivery notification.
class DeliveryNotification {
  final String id;
  final String title;
  final String body;
  final String type;
  final Map<String, dynamic>? data;
  final DateTime receivedAt;
  final bool isRead;

  const DeliveryNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    this.data,
    required this.receivedAt,
    this.isRead = false,
  });

  DeliveryNotification copyWith({bool? isRead}) => DeliveryNotification(
    id: id,
    title: title,
    body: body,
    type: type,
    data: data,
    receivedAt: receivedAt,
    isRead: isRead ?? this.isRead,
  );
}

/// Handles push notifications and local notifications for the delivery partner.
class NotificationService {
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final _notificationController =
      StreamController<DeliveryNotification>.broadcast();
  final List<DeliveryNotification> _notifications = [];
  bool _initialized = false;

  Stream<DeliveryNotification> get notificationStream =>
      _notificationController.stream;
  List<DeliveryNotification> get notifications =>
      List.unmodifiable(_notifications);

  /// Initialize notification services.
  Future<void> init() async {
    if (_initialized) return;
    _initialized = true;

    tz_data.initializeTimeZones();

    // Initialize local notifications
    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (details) {
        // Handle notification tap
        _handleNotificationTap(details.payload);
      },
    );

    // Configure Firebase messaging
    await _configureFirebaseMessaging();
  }

  /// Configure Firebase Cloud Messaging.
  Future<void> _configureFirebaseMessaging() async {
    // Request permission
    final settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized) {
      return;
    }

    // Get FCM token
    final token = await _firebaseMessaging.getToken();
    if (token != null) {
      debugPrint('FCM Token: $token');
      // TODO: Send token to backend
    }

    // Listen for token refresh
    _firebaseMessaging.onTokenRefresh.listen((token) {
      debugPrint('FCM Token refreshed: $token');
      // TODO: Send updated token to backend
    });

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      _handleForegroundMessage(message);
    });

    // Handle background messages
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleBackgroundMessage(message);
    });

    // Check if app opened from notification
    final initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleBackgroundMessage(initialMessage);
    }
  }

  /// Handle a foreground Firebase message.
  void _handleForegroundMessage(RemoteMessage message) {
    final notification = DeliveryNotification(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'general',
      data: message.data,
      receivedAt: DateTime.now(),
    );

    _addNotification(notification);

    // Show local notification
    _showLocalNotification(
      id: notification.hashCode,
      title: notification.title,
      body: notification.body,
      payload: jsonEncode(notification.data),
    );
  }

  /// Handle a background Firebase message.
  void _handleBackgroundMessage(RemoteMessage message) {
    final notification = DeliveryNotification(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'general',
      data: message.data,
      receivedAt: DateTime.now(),
    );

    _addNotification(notification);
  }

  /// Handle notification tap.
  void _handleNotificationTap(String? payload) {
    if (payload == null) return;
    try {
      final data = jsonDecode(payload) as Map<String, dynamic>;
      // TODO: Navigate based on notification type
      debugPrint('Notification tapped: $data');
    } catch (_) {}
  }

  /// Add a notification to the list and broadcast.
  void _addNotification(DeliveryNotification notification) {
    _notifications.insert(0, notification);
    if (_notifications.length > 100) {
      _notifications.removeLast();
    }
    _notificationController.add(notification);
  }

  /// Show a local notification.
  Future<void> _showLocalNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'delivery_partner_channel',
      'Delivery Partner Notifications',
      channelDescription: 'Notifications for delivery partner app',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFF6C3AE1),
      enableVibration: true,
      enableLights: true,
    );
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(id, title, body, details, payload: payload);
  }

  /// Show a new order notification with sound.
  Future<void> showNewOrderNotification({
    required String orderId,
    required double amount,
    required String storeName,
  }) async {
    await _showLocalNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: '🛒 New Order Available!',
      body: 'Order #$orderId from $storeName - ₹${amount.toStringAsFixed(0)}',
      payload: jsonEncode({'type': 'new_order', 'orderId': orderId}),
    );
  }

  /// Show a bonus notification.
  Future<void> showBonusNotification({
    required double amount,
    required String reason,
  }) async {
    await _showLocalNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: '🎉 Bonus Earned!',
      body: 'You earned ₹${amount.toStringAsFixed(0)} - $reason',
      payload: jsonEncode({'type': 'bonus', 'amount': amount}),
    );
  }

  /// Show a wallet update notification.
  Future<void> showWalletNotification({
    required double amount,
    required String type,
  }) async {
    await _showLocalNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: '💰 Wallet Updated',
      body: '$type of ₹${amount.toStringAsFixed(0)} processed',
      payload: jsonEncode({'type': 'wallet', 'amount': amount}),
    );
  }

  /// Mark a notification as read.
  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
    }
  }

  /// Clear all notifications.
  void clearAll() {
    _notifications.clear();
    _localNotifications.cancelAll();
  }

  /// Get unread count.
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  /// Clean up resources.
  void dispose() {
    _notificationController.close();
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) {
  final service = NotificationService();
  service.init();
  ref.onDispose(() => service.dispose());
  return service;
});
