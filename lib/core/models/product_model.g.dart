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
      sku: json['sku'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      currency: json['currency'] as String?,
      imageUrl: json['imageUrl'] as String?,
      images: (json['images'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      isActive: json['isActive'] as bool?,
      attributes: json['attributes'] as Map<String, dynamic>?,
      createdAt: json['created_at'] == null
          ? null
          : DateTime.parse(json['created_at'] as String),
      updatedAt: json['updated_at'] == null
          ? null
          : DateTime.parse(json['updated_at'] as String),
      categoryId: json['categoryId'] as String?,
      subCategoryId: json['subCategoryId'] as String?,
      brandId: json['brandId'] as String?,
      variants: (json['variants'] as List<dynamic>?)
          ?.map((e) => Variant.fromJson(e as Map<String, dynamic>))
          .toList(),
      barcode: json['barcode'] as String?,
      hsnCode: json['hsnCode'] as String?,
      unit: json['unit'] as String?,
      weight: (json['weight'] as num?)?.toDouble(),
      dimensions: json['dimensions'] == null
          ? null
          : Dimension.fromJson(json['dimensions'] as Map<String, dynamic>),
      productDescription: json['productDescription'] as String?,
      ingredients: json['ingredients'] as String?,
      nutrition: json['nutrition'] as String?,
      shelfLife: (json['shelfLife'] as num?)?.toInt(),
      expiryDate: json['expiryDate'] == null
          ? null
          : DateTime.parse(json['expiryDate'] as String),
      manufacturer: json['manufacturer'] as String?,
      countryOfOrigin: json['countryOfOrigin'] as String?,
      seoTitle: json['seoTitle'] as String?,
      seoDescription: json['seoDescription'] as String?,
      seoKeywords: json['seoKeywords'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList(),
      mrp: (json['mrp'] as num?)?.toDouble(),
      sellingPrice: (json['sellingPrice'] as num?)?.toDouble(),
      costPrice: (json['costPrice'] as num?)?.toDouble(),
      discount: (json['discount'] as num?)?.toDouble(),
      flashSalePrice: (json['flashSalePrice'] as num?)?.toDouble(),
      membershipPrice: (json['membershipPrice'] as num?)?.toDouble(),
      comboPrice: (json['comboPrice'] as num?)?.toDouble(),
      tax: (json['tax'] as num?)?.toDouble(),
      dynamicPricingEnabled: json['dynamicPricingEnabled'] as bool?,
    );

Map<String, dynamic> _$$ProductModelImplToJson(_$ProductModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'sku': instance.sku,
      'price': instance.price,
      'currency': instance.currency,
      'imageUrl': instance.imageUrl,
      'images': instance.images,
      'isActive': instance.isActive,
      'attributes': instance.attributes,
      'created_at': instance.createdAt?.toIso8601String(),
      'updated_at': instance.updatedAt?.toIso8601String(),
      'categoryId': instance.categoryId,
      'subCategoryId': instance.subCategoryId,
      'brandId': instance.brandId,
      'variants': instance.variants,
      'barcode': instance.barcode,
      'hsnCode': instance.hsnCode,
      'unit': instance.unit,
      'weight': instance.weight,
      'dimensions': instance.dimensions,
      'productDescription': instance.productDescription,
      'ingredients': instance.ingredients,
      'nutrition': instance.nutrition,
      'shelfLife': instance.shelfLife,
      'expiryDate': instance.expiryDate?.toIso8601String(),
      'manufacturer': instance.manufacturer,
      'countryOfOrigin': instance.countryOfOrigin,
      'seoTitle': instance.seoTitle,
      'seoDescription': instance.seoDescription,
      'seoKeywords': instance.seoKeywords,
      'tags': instance.tags,
      'mrp': instance.mrp,
      'sellingPrice': instance.sellingPrice,
      'costPrice': instance.costPrice,
      'discount': instance.discount,
      'flashSalePrice': instance.flashSalePrice,
      'membershipPrice': instance.membershipPrice,
      'comboPrice': instance.comboPrice,
      'tax': instance.tax,
      'dynamicPricingEnabled': instance.dynamicPricingEnabled,
    };

_$VariantImpl _$$VariantImplFromJson(Map<String, dynamic> json) =>
    _$VariantImpl(
      id: json['id'] as String?,
      sku: json['sku'] as String?,
      name: json['name'] as String?,
      value: json['value'] as String?,
      additionalPrice: (json['additionalPrice'] as num?)?.toDouble(),
      isDefault: json['isDefault'] as bool?,
    );

Map<String, dynamic> _$$VariantImplToJson(_$VariantImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'sku': instance.sku,
      'name': instance.name,
      'value': instance.value,
      'additionalPrice': instance.additionalPrice,
      'isDefault': instance.isDefault,
    };

_$DimensionImpl _$$DimensionImplFromJson(Map<String, dynamic> json) =>
    _$DimensionImpl(
      length: (json['length'] as num?)?.toDouble(),
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      unit: json['unit'] as String?,
    );

Map<String, dynamic> _$$DimensionImplToJson(_$DimensionImpl instance) =>
    <String, dynamic>{
      'length': instance.length,
      'width': instance.width,
      'height': instance.height,
      'unit': instance.unit,
    };
