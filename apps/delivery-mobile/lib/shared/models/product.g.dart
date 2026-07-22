// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProductImpl _$$ProductImplFromJson(Map<String, dynamic> json) =>
    _$ProductImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      shortDescription: json['shortDescription'] as String? ?? '',
      price: (json['price'] as num).toDouble(),
      compareAtPrice: (json['compareAtPrice'] as num?)?.toDouble(),
      imageUrl: json['imageUrl'] as String,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      unit: json['unit'] as String?,
      stock: (json['stock'] as num?)?.toInt() ?? 0,
      sku: json['sku'] as String?,
      categoryId: json['categoryId'] as String?,
      merchantId: json['merchantId'] as String?,
      merchantName: json['merchantName'] as String?,
      rating: (json['rating'] as num?)?.toDouble(),
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 0,
      isFavorite: json['isFavorite'] as bool? ?? false,
      hasVariants: json['hasVariants'] as bool? ?? false,
      tags: (json['tags'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$ProductImplToJson(_$ProductImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'shortDescription': instance.shortDescription,
      'price': instance.price,
      'compareAtPrice': instance.compareAtPrice,
      'imageUrl': instance.imageUrl,
      'images': instance.images,
      'unit': instance.unit,
      'stock': instance.stock,
      'sku': instance.sku,
      'categoryId': instance.categoryId,
      'merchantId': instance.merchantId,
      'merchantName': instance.merchantName,
      'rating': instance.rating,
      'reviewCount': instance.reviewCount,
      'isFavorite': instance.isFavorite,
      'hasVariants': instance.hasVariants,
      'tags': instance.tags,
    };
