import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'coupon.freezed.dart';
part 'coupon.g.dart';

@freezed
@JsonSerializable()
class Coupon with _$Coupon {
  const factory Coupon({
    required String id,
    required String code,
    required String description,
    required double discountAmount,
    required double? discountPercentage,
    required DateTime? validFrom,
    required DateTime? validUntil,
    required bool? isActive,
    required int? usageLimit,
    required int? usedCount,
    required bool? isAutoApply,
  }) = _Coupon;

  factory Coupon.fromJson(Map<String, dynamic> json) => _$CouponFromJson(json);
  Map<String, dynamic> toJson() => _$CouponToJson(this);
}