// lib/features/notifications/domain/repository/notification_repository.dart
import '../entities/notification.dart';

abstract class NotificationRepository {
  Future<List<Notification>> getNotifications({
    int limit = 20,
    int offset = 0,
  });

  Future<Notification> getNotificationById(String id);

  Future<void> markAsRead(String notificationId);

  Future<void> markAllAsRead();

  Future<void> deleteNotification(String notificationId);

  Future<int> getUnreadCount();

  Stream<List<Notification>> notificationStream();
}