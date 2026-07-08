import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'product_model.freezed.dart';
part 'product_model.g.dart';

@freeze
class ProductModel with _$ProductModel {
  const ProductModel._();

  factory ProductModel({
    String? id,
    String? name,
    String? description,
    String? sku,
    double? price,
    String? currency,
    String? imageUrl,
    List<String>? images,
    bool? isActive,
    Map<String, dynamic>? attributes,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$ProductModelFromJson(json);
}