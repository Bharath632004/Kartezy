// lib/features/notifications/data/datasource/notification_remote_data_source_impl.dart
import 'package:customer_mobile/core/network/api_constants.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/features/notifications/data/datasource/notification_remote_data_source.dart';
import 'package:customer_mobile/features/notifications/domain/entities/notification.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

class NotificationRemoteDataSourceImpl implements NotificationRemoteDataSource {
  final DioClient _dioClient;
  final Ref _ref;

  NotificationRemoteDataSourceImpl(this._ref)
      : _dioClient = DioClient();

  @override
  Future<List<Notification>> getNotifications({
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _dioClient.get(
        ApiConstants.notificationsEndpoint,
        queryParameters: {
          'limit': limit,
          'offset': offset,
        },
      );
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Notification.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Failed to get notifications: ${e.message}');
    }
  }

  @override
  Future<void> markAsRead(String notificationId) async {
    try {
      await _dioClient.post(
        '${ApiConstants.notificationsEndpoint}/$notificationId/read',
      );
    } on DioException catch (e) {
      throw Exception('Failed to mark notification as read: ${e.message}');
    }
  }

  @override
  Future<void> markAllAsRead() async {
    try {
      await _dioClient.post(
        '${ApiConstants.notificationsEndpoint}/mark-all-read',
      );
    } on DioException catch (e) {
      throw Exception('Failed to mark all notifications as read: ${e.message}');
    }
  }

  @override
  Future<void> deleteNotification(String notificationId) async {
    try {
      await _dioClient.delete(
        '${ApiConstants.notificationsEndpoint}/$notificationId',
      );
    } on DioException catch (e) {
      throw Exception('Failed to delete notification: ${e.message}');
    }
  }

  @override
  Future<int> getUnreadCount() async {
    try {
      final response = await _dioClient.get(
        '${ApiConstants.notificationsEndpoint}/unred-count',
      );
      return response.data['count'] as int;
    } on DioException catch (e) {
      throw Exception('Failed to get unread count: ${e.message}');
    }
  }

  @override
  Future<Notification> sendNotification({
    required String title,
    required String body,
    String? type,
    String? relatedId,
    Map<String, dynamic>? data,
  }) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.notificationsEndpoint,
        data: {
          'title': title,
          'body': body,
          'type': type,
          'relatedId': relatedId,
          'data': data,
        },
      );
      return Notification.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to send notification: ${e.message}');
    }
  }
}