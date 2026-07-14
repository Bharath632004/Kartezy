// lib/shared/models/order_item.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/shared/models/product.dart';

part 'order_item.freezed.dart';
part 'order_item.g.dart';

@freezed
class OrderItem with _$OrderItem {
  const factory OrderItem({
    required String id,
    required String productId,
    required String productName,
    required double price,
    required int quantity,
    required Map<String, String>
    selectedVariants, // e.g., {'size': 'M', 'color': 'Red'}
    required double total,
    required Product product,
  }) = _OrderItem;

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);
}
