// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'earnings_record.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$EarningsRecordImpl _$$EarningsRecordImplFromJson(Map<String, dynamic> json) =>
    _$EarningsRecordImpl(
      id: json['id'] as String,
      partnerId: json['partnerId'] as String,
      orderId: json['orderId'] as String?,
      type: $enumDecode(_$EarningTypeEnumMap, json['type']),
      amount: (json['amount'] as num).toDouble(),
      description: json['description'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      isCredited: json['isCredited'] as bool,
    );

Map<String, dynamic> _$$EarningsRecordImplToJson(
  _$EarningsRecordImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'partnerId': instance.partnerId,
  'orderId': instance.orderId,
  'type': _$EarningTypeEnumMap[instance.type]!,
  'amount': instance.amount,
  'description': instance.description,
  'createdAt': instance.createdAt.toIso8601String(),
  'isCredited': instance.isCredited,
};

const _$EarningTypeEnumMap = {
  EarningType.deliveryFee: 'deliveryFee',
  EarningType.tip: 'tip',
  EarningType.bonus: 'bonus',
  EarningType.incentive: 'incentive',
  EarningType.penalty: 'penalty',
  EarningType.referral: 'referral',
  EarningType.adjustment: 'adjustment',
};

_$EarningsSummaryImpl _$$EarningsSummaryImplFromJson(
  Map<String, dynamic> json,
) => _$EarningsSummaryImpl(
  totalEarnings: (json['totalEarnings'] as num).toDouble(),
  deliveryFees: (json['deliveryFees'] as num).toDouble(),
  tips: (json['tips'] as num).toDouble(),
  bonuses: (json['bonuses'] as num).toDouble(),
  incentives: (json['incentives'] as num).toDouble(),
  penalties: (json['penalties'] as num).toDouble(),
  totalOrders: (json['totalOrders'] as num).toInt(),
  averagePerOrder: (json['averagePerOrder'] as num).toDouble(),
  periodStart: DateTime.parse(json['periodStart'] as String),
  periodEnd: DateTime.parse(json['periodEnd'] as String),
);

Map<String, dynamic> _$$EarningsSummaryImplToJson(
  _$EarningsSummaryImpl instance,
) => <String, dynamic>{
  'totalEarnings': instance.totalEarnings,
  'deliveryFees': instance.deliveryFees,
  'tips': instance.tips,
  'bonuses': instance.bonuses,
  'incentives': instance.incentives,
  'penalties': instance.penalties,
  'totalOrders': instance.totalOrders,
  'averagePerOrder': instance.averagePerOrder,
  'periodStart': instance.periodStart.toIso8601String(),
  'periodEnd': instance.periodEnd.toIso8601String(),
};
