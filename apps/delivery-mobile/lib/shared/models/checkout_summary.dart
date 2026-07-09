import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';

part 'checkout_summary.freezed.dart';
part 'checkout_summary.g.dart';

@freezed
class CheckoutSummary with _$CheckoutSummary, EquatableMixin {
  const factory CheckoutSummary({
    required String id,
    required String? userId, // nullable for guest user
    required List<CartItem> items,
    required String? couponCode,
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
  }) = _CheckoutSummary;

  factory CheckoutSummary.fromJson(Map<String, dynamic> json) =>
      _$CheckoutSummaryFromJson(json);
}