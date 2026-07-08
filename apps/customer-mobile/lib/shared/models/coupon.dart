// lib/shared/models/coupon.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'coupon.freezet.dart';
part 'coupon.g.dart';

@freezed
class Coupon with _$Coupon {
  const factory Coupon({
    required String id,
    required String code,
    required String description,
    required double discountAmount,
    String? discountPercentage,
    DateTime? validFrom,
    DateTime? validUntil,
    bool? isActive,
  }) = _Coupon;

  factory Coupon.fromJson(Map<String, dynamic> json) => _$CouponFromJson(json);
}
