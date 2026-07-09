import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';

part 'cart.freezed.dart';
part 'cart.g.dart';

@freezed
class Cart with _$Cart {
  const factory Cart({
    required String id,
    required String? userId, // nullable for guest cart
    required List<CartItem> items,
    required String? couponCode,
    required double discountAmount,
    required double totalAmount,
    required int itemCount,
    // Additional fields for charge breakdown
    required double platformFee,
    required double deliveryCharges,
    required double packagingFee,
    required double gstAmount,
    required double tipAmount,
    required double walletAmount,
    required double netAmount,
  }) = _Cart;

  factory Cart.fromJson(Map<String, dynamic> json) => _$CartFromJson(json);
}