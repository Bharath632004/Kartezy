import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:delivery_mobile/shared/models/address.dart';
import 'package:delivery_mobile/shared/models/order_item.dart';

part 'delivery_order.freezed.dart';
part 'delivery_order.g.dart';

/// Represents the delivery phase of an order.
enum DeliveryPhase {
  assigned,
  navigatingToStore,
  atStore,
  pickedUp,
  navigatingToCustomer,
  atCustomer,
  delivered,
  failed,
}

/// A delivery order assigned to a delivery partner.
@freezed
class DeliveryOrder with _$DeliveryOrder {
  const factory DeliveryOrder({
    required String id,
    required String orderNumber,
    required String customerName,
    required String customerPhone,
    required String storeName,
    required String storePhone,
    required double storeLatitude,
    required double storeLongitude,
    required Address deliveryAddress,
    required List<OrderItem> items,
    required int itemCount,
    required double orderAmount,
    required double deliveryFee,
    required double tipAmount,
    required double totalEarning,
    required String orderStatus,
    required DeliveryPhase phase,
    required DateTime assignedAt,
    required DateTime estimatedPickupTime,
    required DateTime estimatedDeliveryTime,
    required String? pickupOtp,
    required String? deliveryOtp,
    String? deliveryInstructions,
    String? merchantNotes,
    double? distanceToStore,
    double? distanceToCustomer,
    Duration? etaToStore,
    Duration? etaToCustomer,
    bool? isExpress,
    bool? isStacked,
    String? stackedWithOrderId,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _DeliveryOrder;

  factory DeliveryOrder.fromJson(Map<String, dynamic> json) =>
      _$DeliveryOrderFromJson(json);
}
