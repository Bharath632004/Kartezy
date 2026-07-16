import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:delivery_mobile/shared/models/address.dart';
import 'package:delivery_mobile/shared/models/order_item.dart';

part 'order.freezed.dart';
part 'order.g.dart';

@freezed
class Order with _$Order {
  const factory Order({
    required String id,
    required String? userId,
    required String cartId,
    required List<OrderItem> items,
    required double discountAmount,
    required double totalAmount,
    required int itemCount,
    required double platformFee,
    required double deliveryCharges,
    required double packagingFee,
    required double gstAmount,
    required double tipAmount,
    required double walletAmount,
    required double netAmount,
    required Address deliveryAddress,
    required Address? billingAddress,
    required String orderStatus,
    required String paymentStatus,
    required String? paymentMethod,
    required String? deliveryInstructions,
    required bool contactlessDelivery,
    required DateTime? deliverySlotStart,
    required DateTime? deliverySlotEnd,
    required DateTime estimatedDeliveryTime,
    required String? couponCode,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Order;

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
}
