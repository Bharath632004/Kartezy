// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_variant.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProductVariantImpl _$$ProductVariantImplFromJson(Map<String, dynamic> json) =>
    _$ProductVariantImpl(
      id: json['id'] as String,
      productId: json['productId'] as String,
      sku: json['sku'] as String,
      price: (json['price'] as num).toDouble(),
      attributes: Map<String, String>.from(json['attributes'] as Map),
      isDefault: json['isDefault'] as bool,
    );

Map<String, dynamic> _$$ProductVariantImplToJson(
  _$ProductVariantImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'productId': instance.productId,
  'sku': instance.sku,
  'price': instance.price,
  'attributes': instance.attributes,
  'isDefault': instance.isDefault,
};
