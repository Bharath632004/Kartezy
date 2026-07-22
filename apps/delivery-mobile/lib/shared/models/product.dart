import 'package:freezed_annotation/freezed_annotation.dart';

part 'product.freezed.dart';
part 'product.g.dart';

@freezed
class Product with _$Product {
  const factory Product({
    required String id,
    required String name,
    required String description,
    @Default('') String shortDescription,
    required double price,
    double? compareAtPrice,
    required String imageUrl,
    @Default([]) List<String> images,
    String? unit,
    @Default(0) int stock,
    String? sku,
    String? categoryId,
    String? merchantId,
    String? merchantName,
    double? rating,
    @Default(0) int reviewCount,
    @Default(false) bool isFavorite,
    @Default(false) bool hasVariants,
    @Default([]) List<String> tags,
  }) = _Product;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
}

extension ProductExtensions on Product {
  /// Returns the discount percentage if there's a compare-at price.
  double? get discountPercentage {
    if (compareAtPrice != null && compareAtPrice! > 0 && compareAtPrice! > price) {
      return ((compareAtPrice! - price) / compareAtPrice!) * 100;
    }
    return null;
  }

  /// Whether the product is currently available for purchase.
  bool get isAvailable => stock > 0;
}
