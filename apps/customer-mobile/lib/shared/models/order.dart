// lib/shared/models/order.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:customer_mobile/shared/models/address.dart';
import 'package:customer_mobile/shared/models/order_item.dart';

part 'order.freezed.dart';
part 'order.g.dart';

@freezed
class Order with _$Order, EquatableMixin {
  const factory Order({
    required String id,
    required String? userId, // nullable for guest user
    required String cartId, // id of the cart that was converted to order
    required List<OrderItem> items, // snapshot of cart items at the time of order
    // Financial breakdown (similar to Cart)
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
    // Delivery details
    required Address deliveryAddress,
    required Address? billingAddress, // optional, if different from delivery
    required String orderStatus, // e.g., 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    required String paymentStatus, // e.g., 'pending', 'paid', 'failed', 'refunded'
    required String? paymentMethod, // e.g., 'razorpay', 'cashfree', 'stripe', 'phonepe', 'google_pay', 'paytm', 'upi', 'credit_card', 'debit_card', 'net_banking', 'wallet', 'cod'
    required String? deliveryInstructions,
    required bool contactlessDelivery,
    required DateTime? deliverySlotStart, // for scheduled delivery
    required DateTime? deliverySlotEnd,
    required DateTime estimatedDeliveryTime,
    required String? couponCode, // if any coupon applied
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Order;

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
}