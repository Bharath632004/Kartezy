// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coupon.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Coupon _$CouponFromJson(Map<String, dynamic> json) => Coupon(
      id: json['id'] as String,
      code: json['code'] as String,
      description: json['description'] as String,
      discountAmount: (json['discountAmount'] as num).toDouble(),
      discountPercentage: (json['discountPercentage'] as num?)?.toDouble(),
      validFrom: json['validFrom'] == null
          ? null
          : DateTime.parse(json['validFrom'] as String),
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
      isActive: json['isActive'] as bool?,
      usageLimit: (json['usageLimit'] as num?)?.toInt(),
      usedCount: (json['usedCount'] as num?)?.toInt(),
      isAutoApply: json['isAutoApply'] as bool?,
    );

Map<String, dynamic> _$CouponToJson(Coupon instance) => <String, dynamic>{
      'id': instance.id,
      'code': instance.code,
      'description': instance.description,
      'discountAmount': instance.discountAmount,
      'discountPercentage': instance.discountPercentage,
      'validFrom': instance.validFrom?.toIso8601String(),
      'validUntil': instance.validUntil?.toIso8601String(),
      'isActive': instance.isActive,
      'usageLimit': instance.usageLimit,
      'usedCount': instance.usedCount,
      'isAutoApply': instance.isAutoApply,
    };

_$CouponImpl _$$CouponImplFromJson(Map<String, dynamic> json) => _$CouponImpl(
      id: json['id'] as String,
      code: json['code'] as String,
      description: json['description'] as String,
      discountAmount: (json['discountAmount'] as num).toDouble(),
      discountPercentage: (json['discountPercentage'] as num?)?.toDouble(),
      validFrom: json['validFrom'] == null
          ? null
          : DateTime.parse(json['validFrom'] as String),
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
      isActive: json['isActive'] as bool?,
      usageLimit: (json['usageLimit'] as num?)?.toInt(),
      usedCount: (json['usedCount'] as num?)?.toInt(),
      isAutoApply: json['isAutoApply'] as bool?,
    );

Map<String, dynamic> _$$CouponImplToJson(_$CouponImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'code': instance.code,
      'description': instance.description,
      'discountAmount': instance.discountAmount,
      'discountPercentage': instance.discountPercentage,
      'validFrom': instance.validFrom?.toIso8601String(),
      'validUntil': instance.validUntil?.toIso8601String(),
      'isActive': instance.isActive,
      'usageLimit': instance.usageLimit,
      'usedCount': instance.usedCount,
      'isAutoApply': instance.isAutoApply,
    };
