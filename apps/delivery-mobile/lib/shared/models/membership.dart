import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';

part 'membership.freezed.dart';
part 'membership.g.dart';

@freezed
class MembershipPlan with _$MembershipPlan, EquatableMixin {
  const factory MembershipPlan({
    required String id,
    required String name,
    required double price,
    required String duration, // e.g., 'monthly', 'yearly'
    required List<String> benefits,
    required bool isPopular,
  }) = _MembershipPlan;

  factory MembershipPlan.fromJson(Map<String, dynamic> json) =>
      _$MembershipPlanFromJson(json);
}

@freezed
class Membership with _$Membership, EquatableMixin {
  const factory Membership({
    required String planId,
    required DateTime startDate,
    required DateTime endDate,
    required bool isActive,
    required List<String> usedBenefits,
  }) = _Membership;

  factory Membership.fromJson(Map<String, dynamic> json) =>
      _$MembershipFromJson(json);
}

@freezed
class MembershipBenefit with _$MembershipBenefit, EquatableMixin {
  const factory MembershipBenefit({
    required String id,
    required String title,
    required String description,
    required String icon,
  }) = _MembershipBenefit;

  factory MembershipBenefit.fromJson(Map<String, dynamic> json) =>
      _$MembershipBenefitFromJson(json);
}