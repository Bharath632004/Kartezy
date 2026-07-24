import 'package:freezed_annotation/freezed_annotation.dart';

part 'delivery_notification.freezed.dart';
part 'delivery_notification.g.dart';

/// Notification priority level.
enum NotificationPriority { low, normal, high, urgent }

/// Notification category.
enum NotificationCategory {
  order,
  earnings,
  wallet,
  performance,
  support,
  announcement,
  safety,
  system,
}

/// Represents a delivery partner notification.
@freezed
class DeliveryNotificationItem with _$DeliveryNotificationItem {
  const factory DeliveryNotificationItem({
    required String id,
    required String title,
    required String body,
    required NotificationCategory category,
    required NotificationPriority priority,
    Map<String, dynamic>? data,
    required bool isRead,
    required DateTime createdAt,
  }) = _DeliveryNotificationItem;

  factory DeliveryNotificationItem.fromJson(Map<String, dynamic> json) =>
      _$DeliveryNotificationItemFromJson(json);
}
