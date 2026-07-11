// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'inventory_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$InventoryModelImpl _$$InventoryModelImplFromJson(Map<String, dynamic> json) =>
    _$InventoryModelImpl(
      id: json['id'] as String?,
      productId: json['productId'] as String?,
      warehouseId: json['warehouseId'] as String?,
      quantity: (json['quantity'] as num?)?.toInt(),
      reserved: (json['reserved'] as num?)?.toInt(),
      available: (json['available'] as num?)?.toInt(),
      location: json['location'] as String?,
      updatedAt: json['updated_at'] == null
          ? null
          : DateTime.parse(json['updated_at'] as String),
      createdAt: json['created_at'] == null
          ? null
          : DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$InventoryModelImplToJson(
  _$InventoryModelImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'productId': instance.productId,
  'warehouseId': instance.warehouseId,
  'quantity': instance.quantity,
  'reserved': instance.reserved,
  'available': instance.available,
  'location': instance.location,
  'updated_at': instance.updatedAt?.toIso8601String(),
  'created_at': instance.createdAt?.toIso8601String(),
};
