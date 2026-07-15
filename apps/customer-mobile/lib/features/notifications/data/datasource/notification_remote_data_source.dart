// lib/features/notifications/data/datasource/notification_remote_data_source.dart
import 'package:customer_mobile/features/notifications/domain/entities/notification.dart';

abstract class NotificationRemoteDataSource {
  Future<List<Notification>> getNotifications({int limit = 20, int offset = 0});

  Future<Notification> getNotificationById(String id);

  Future<void> markAsRead(String notificationId);

  Future<void> markAllAsRead();

  Future<void> deleteNotification(String notificationId);

  Future<int> getUnreadCount();

  Stream<List<Notification>> notificationStream();

  Future<Notification> sendNotification({
    required String title,
    required String body,
    String? type,
    String? relatedId,
    Map<String, dynamic>? data,
  });
}
