import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:kartezy_core/core/models/address_model.dart';

part 'delivery_order_model.freezed.dart';
part 'delivery_order_model.g.dart';

@freeze
class DeliveryOrder with _$DeliveryOrder {
  const DeliveryOrder._();
  factory DeliveryOrder.fromJson(Map<String, dynamic> json) =>
      _$DeliveryOrderFromJson(json);

  final String? id;
  final String? orderId;
  final String? merchantId;
  final String? customerId;
  final Address? pickupAddress;
  final Address? deliveryAddress;
  final String? status; // pending, accepted, picked_up, delivered, cancelled
  final double? distance;
  final double? estimatedDuration; // in minutes
  final double? rewardAmount;
  final String? createdAt;
  final String? updatedAt;
  final String? expiresAt; // When order expires if not accepted
}
