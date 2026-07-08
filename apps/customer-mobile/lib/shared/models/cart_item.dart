import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/shared/models/product.dart';

part 'cart_item.freezed.dart';
part 'cart_item.g.dart';

@freezed
class CartItem with _$CartItem {
  const factory CartItem({
    required String id,
    required String productId,
    required Product product,
    required int quantity,
    required Map<String, String> selectedVariants, // e.g., {'size': 'M', 'color': 'Red'}
  }) = _CartItem;

  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);
}