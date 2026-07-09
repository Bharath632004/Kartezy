// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'membership.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MembershipPlanImpl _$$MembershipPlanImplFromJson(Map<String, dynamic> json) =>
    _$MembershipPlanImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      duration: json['duration'] as String,
      benefits:
          (json['benefits'] as List<dynamic>).map((e) => e as String).toList(),
      isPopular: json['isPopular'] as bool,
    );

Map<String, dynamic> _$$MembershipPlanImplToJson(
        _$MembershipPlanImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'price': instance.price,
      'duration': instance.duration,
      'benefits': instance.benefits,
      'isPopular': instance.isPopular,
    };

_$MembershipUserImpl _$$MembershipUserImplFromJson(Map<String, dynamic> json) =>
    _$MembershipUserImpl(
      planId: json['planId'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      isActive: json['isActive'] as bool,
      usedBenefits: (json['usedBenefits'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$$MembershipUserImplToJson(
        _$MembershipUserImpl instance) =>
    <String, dynamic>{
      'planId': instance.planId,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'isActive': instance.isActive,
      'usedBenefits': instance.usedBenefits,
    };

_$MembershipBenefitImpl _$$MembershipBenefitImplFromJson(
        Map<String, dynamic> json) =>
    _$MembershipBenefitImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
    );

Map<String, dynamic> _$$MembershipBenefitImplToJson(
        _$MembershipBenefitImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'icon': instance.icon,
    };
