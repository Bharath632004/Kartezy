import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'product_model.freezed.dart';
part 'product_model.g.dart';

@freezed
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

    // Additional fields for product management
    String? categoryId,
    String? subCategoryId,
    String? brandId,
    List<Variant>? variants,
    String? barcode,
    String? hsnCode,
    String? unit,
    double? weight,
    Dimension? dimensions,
    String? productDescription,
    String? ingredients,
    String? nutrition,
    int? shelfLife, // in days
    DateTime? expiryDate,
    String? manufacturer,
    String? countryOfOrigin,
    String? seoTitle,
    String? seoDescription,
    String? seoKeywords,
    List<String>? tags,

    // Pricing
    double? mrp,
    double? sellingPrice,
    double? costPrice,
    double? discount,
    double? flashSalePrice,
    double? membershipPrice,
    double? comboPrice,
    double? tax, // GST percentage
    bool? dynamicPricingEnabled,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$ProductModelFromJson(json);
}

@freezed
class Variant with _$Variant {
  const Variant._();

  factory Variant({
    String? id,
    String? sku,
    String? name,
    String? value,
    double? additionalPrice,
    bool? isDefault,
  }) = _Variant;

  factory Variant.fromJson(Map<String, dynamic> json) =>
      _$VariantFromJson(json);
}

@freezed
class Dimension with _$Dimension {
  const Dimension._();

  factory Dimension({
    double? length,
    double? width,
    double? height,
    String? unit,
  }) = _Dimension;

  factory Dimension.fromJson(Map<String, dynamic> json) =>
      _$DimensionFromJson(json);
}
