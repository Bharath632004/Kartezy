import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'cart_model.freezed.dart';
part 'cart_model.g.dart';

@freeze
class CartModel with _$CartModel {
  const CartModel._();

  factory CartModel({
    String? id,
    String? userId,
    String? guestId,
    List<CartItemModel>? items,
    double? subtotal,
    double? discount,
    double? tax,
    double? shipping,
    double? total,
    String? currency,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _CartModel;

  factory CartModel.fromJson(Map<String, dynamic> json) =>
      _$CartModelFromJson(json);
}

@freeze
class CartItemModel with _$CartItemModel {
  const CartItemModel._();

  factory CartItemModel({
    String? id,
    String? productId,
    String? variantId,
    int? quantity,
    double? price,
    double? totalPrice,
    String? name,
    String? sku,
    String? imageUrl,
    Map<String, dynamic>? attributes,
  }) = _CartItemModel;

  factory CartItemModel.fromJson(Map<String, dynamic> json) =>
      _$CartItemModelFromJson(json);
}