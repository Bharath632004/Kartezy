// lib/features/notifications/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import '../data/datasource/notification_remote_data_source_impl.dart';
import '../data/repository/notification_repository_impl.dart';
import '../domain/repository/notification_repository.dart';
import '../domain/usecase/get_notifications.dart';
import '../domain/usecase/mark_notification_as_read.dart';
import '../domain/usecase/mark_all_notifications_as_read.dart';
import '../domain/usecase/delete_notification.dart';
import '../domain/usecase/get_unread_count.dart';

// Provider for notification remote data source
final notificationRemoteDataSourceProvider = Provider<NotificationRemoteDataSource>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return NotificationRemoteDataSourceImpl(dioClient);
});

// Provider for notification repository
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl(ref.read(notificationRemoteDataSourceProvider));
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