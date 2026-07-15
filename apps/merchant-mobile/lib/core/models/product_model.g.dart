// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProductModelImpl _$$ProductModelImplFromJson(Map<String, dynamic> json) =>
    _$ProductModelImpl(
      id: json['id'] as String?,
      name: json['name'] as String?,
      description: json['description'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      sku: json['sku'] as String?,
      barcode: json['barcode'] as String?,
      categoryId: json['categoryId'] as String?,
      brandId: json['brandId'] as String?,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      imageUrl: json['imageUrl'] as String?,
      dimensions: json['dimensions'] as String?,
      hsnCode: json['hsnCode'] as String?,
      mrp: (json['mrp'] as num?)?.toDouble(),
      costPrice: (json['costPrice'] as num?)?.toDouble(),
      discount: (json['discount'] as num?)?.toDouble(),
      flashSalePrice: (json['flashSalePrice'] as num?)?.toDouble(),
      membershipPrice: (json['membershipPrice'] as num?)?.toDouble(),
      comboPrice: (json['comboPrice'] as num?)?.toDouble(),
      tax: (json['tax'] as num?)?.toDouble(),
      dynamicPricingEnabled: json['dynamicPricingEnabled'] as bool?,
      shelfLife: json['shelfLife'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$$ProductModelImplToJson(_$ProductModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'price': instance.price,
      'sku': instance.sku,
      'barcode': instance.barcode,
      'categoryId': instance.categoryId,
      'brandId': instance.brandId,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'imageUrl': instance.imageUrl,
      'dimensions': instance.dimensions,
      'hsnCode': instance.hsnCode,
      'mrp': instance.mrp,
      'costPrice': instance.costPrice,
      'discount': instance.discount,
      'flashSalePrice': instance.flashSalePrice,
      'membershipPrice': instance.membershipPrice,
      'comboPrice': instance.comboPrice,
      'tax': instance.tax,
      'dynamicPricingEnabled': instance.dynamicPricingEnabled,
      'shelfLife': instance.shelfLife,
      'tags': instance.tags,
    };
