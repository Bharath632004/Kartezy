import 'package:freezed_annotation/freezed_annotation.dart';

part 'delivery_notification_model.freezed.dart';
part 'delivery_notification_model.g.dart';

@freeze
class DeliveryNotification with _$DeliveryNotification {
  const DeliveryNotification._();
  factory DeliveryNotification.fromJson(Map<String, dynamic> json) =>
      _$DeliveryNotificationFromJson(json);

  final String? id;
  final String? title;
  final String? body;
  final String? type; // new_order, pickup_reminder, delivery_reminder, incentives, wallet_credit, support_message
  final bool? isRead;
  final String? createdAt;
  final Map<String, dynamic>? data; // Additional data like orderId, amount, etc.
}
