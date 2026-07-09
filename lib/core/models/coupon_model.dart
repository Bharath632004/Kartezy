import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'coupon_model.freezed.dart';
part 'coupon_model.g.dart';

@freezed
class CouponModel with _$CouponModel {
  const CouponModel._();

  factory CouponModel({
    String? id,
    String? code,
    String? description,
    double? discountAmount,
    double? discountPercentage,
    String? discountType, // fixed or percentage
    double? minimumPurchase,
    DateTime? startDate,
    DateTime? endDate,
    int? usageLimit,
    int? usageCount,
    bool? isActive,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _CouponModel;

  factory CouponModel.fromJson(Map<String, dynamic> json) =>
      _$CouponModelFromJson(json);
}