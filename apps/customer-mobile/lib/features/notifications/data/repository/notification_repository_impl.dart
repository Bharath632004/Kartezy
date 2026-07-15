// lib/features/notifications/data/repository/notification_repository_impl.dart
import 'package:customer_mobile/features/notifications/data/datasource/notification_remote_data_source.dart';
import 'package:customer_mobile/features/notifications/domain/entities/notification.dart';
import 'package:customer_mobile/features/notifications/domain/repository/notification_repository.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  final NotificationRemoteDataSource _remoteDataSource;

  NotificationRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Notification>> getNotifications({
    int limit = 20,
    int offset = 0,
    bool unreadOnly = false,
  }) async {
    final notifications = await _remoteDataSource.getNotifications(
      limit: limit,
      offset: offset,
    );

    if (unreadOnly) {
      return notifications.where((n) => !n.isRead).toList();
    }
    return notifications;
  }

  @override
  Future<Notification> getNotificationById(String id) async {
    return await _remoteDataSource.getNotificationById(id);
  }

  @override
  Future<void> markAsRead(String notificationId) async {
    await _remoteDataSource.markAsRead(notificationId);
  }

  @override
  Future<void> markAllAsRead() async {
    await _remoteDataSource.markAllAsRead();
  }

  @override
  Future<void> deleteNotification(String notificationId) async {
    await _remoteDataSource.deleteNotification(notificationId);
  }

  @override
  Future<int> getUnreadCount() async {
    return await _remoteDataSource.getUnreadCount();
  }

  @override
  Stream<List<Notification>> notificationStream() {
    return _remoteDataSource.notificationStream();
  }

  Future<void> subscribeToTopic(String topic) async {
    // Implementation would depend on your push notification service
    // For now, we'll leave it as a placeholder
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    // Implementation would depend on your push notification service
    // For now, we'll leave it as a placeholder
  }
}
