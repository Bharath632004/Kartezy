import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';

part 'product_variant.freezed.dart';
part 'product_variant.g.dart';

@freezed
class ProductVariant with _$ProductVariant, EquatableMixin {
  const factory ProductVariant({
    required String id,
    required String productId,
    required String sku,
    required double price,
    required Map<String, String>
    attributes, // e.g., {'size': 'M', 'color': 'Red'}
    required bool isDefault,
  }) = _ProductVariant;

  factory ProductVariant.fromJson(Map<String, dynamic> json) =>
      _$ProductVariantFromJson(json);
}
