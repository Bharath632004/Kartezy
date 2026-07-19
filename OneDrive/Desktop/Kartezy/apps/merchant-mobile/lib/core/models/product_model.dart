import 'package:freezed_annotation/freezed_annotation.dart';

part 'product_model.freezed.dart';
part 'product_model.g.dart';

@freezed
class ProductModel with _$ProductModel {
  const ProductModel._();

  factory ProductModel({
    String? id,
    String? name,
    String? description,
    double? price,
    String? currency,
    String? sku,
    String? barcode,
    String? categoryId,
    String? brandId,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? imageUrl,
    String? dimensions,
    String? hsnCode,
    double? mrp,
    double? costPrice,
    double? discount,
    double? flashSalePrice,
    double? membershipPrice,
    double? comboPrice,
    double? tax,
    bool? dynamicPricingEnabled,
    String? shelfLife,
    List<String>? tags,
    String? unit,
    double? weight,
    double? sellingPrice,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$$ProductModelImplFromJson(json);
}
