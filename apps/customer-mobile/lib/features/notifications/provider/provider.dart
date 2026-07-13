// lib/features/notifications/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/datasource/notification_remote_data_source_impl.dart';
import 'data/repository/notification_repository_impl.dart';
import 'domain/repository/notification_repository.dart';

// Provider for notification remote data source
final notificationRemoteDataSourceProvider = Provider<NotificationRemoteDataSource>((ref) {
  return NotificationRemoteDataSourceImpl(ref);
});

// Provider for notification repository
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl(ref);
});

// Provider for get notifications use case
final getNotificationsProvider = Provider((ref) {
  return GetNotifications(ref.read(notificationRepositoryProvider));
});

// Provider for mark notification as read use case
final markNotificationAsReadProvider = Provider((ref) {
  return MarkNotificationAsRead(ref.read(notificationRepositoryProvider));
});

// Provider for mark all notifications as read use case
final markAllNotificationsAsReadProvider = Provider((ref) {
  return MarkAllNotificationsAsRead(ref.read(notificationRepositoryProvider));
});

// Provider for delete notification use case
final deleteNotificationProvider = Provider((ref) {
  return DeleteNotification(ref.read(notificationRepositoryProvider));
});

// Provider for get unread count use case
final getUnreadCountProvider = Provider((ref) {
  return GetUnreadCount(ref.read(notificationRepositoryProvider));
});