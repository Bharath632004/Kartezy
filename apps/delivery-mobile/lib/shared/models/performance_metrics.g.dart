// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_metrics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PerformanceMetricsImpl _$$PerformanceMetricsImplFromJson(
  Map<String, dynamic> json,
) => _$PerformanceMetricsImpl(
  totalOrdersDelivered: (json['totalOrdersDelivered'] as num).toInt(),
  totalOrdersAssigned: (json['totalOrdersAssigned'] as num).toInt(),
  totalOrdersCancelled: (json['totalOrdersCancelled'] as num).toInt(),
  acceptanceRate: (json['acceptanceRate'] as num).toDouble(),
  completionRate: (json['completionRate'] as num).toDouble(),
  onTimeRate: (json['onTimeRate'] as num).toDouble(),
  customerRating: (json['customerRating'] as num).toDouble(),
  merchantRating: (json['merchantRating'] as num).toDouble(),
  averageDeliveryTimeMinutes: (json['averageDeliveryTimeMinutes'] as num)
      .toDouble(),
  currentStreak: (json['currentStreak'] as num).toInt(),
  longestStreak: (json['longestStreak'] as num).toInt(),
  rank: (json['rank'] as num).toInt(),
  totalPartners: (json['totalPartners'] as num).toInt(),
  leaderboard: (json['leaderboard'] as List<dynamic>?)
      ?.map((e) => LeaderboardEntry.fromJson(e as Map<String, dynamic>))
      .toList(),
  badges: (json['badges'] as List<dynamic>?)?.map((e) => e as String).toList(),
  performanceScore: (json['performanceScore'] as num?)?.toInt(),
  periodStart: json['periodStart'] == null
      ? null
      : DateTime.parse(json['periodStart'] as String),
  periodEnd: json['periodEnd'] == null
      ? null
      : DateTime.parse(json['periodEnd'] as String),
);

Map<String, dynamic> _$$PerformanceMetricsImplToJson(
  _$PerformanceMetricsImpl instance,
) => <String, dynamic>{
  'totalOrdersDelivered': instance.totalOrdersDelivered,
  'totalOrdersAssigned': instance.totalOrdersAssigned,
  'totalOrdersCancelled': instance.totalOrdersCancelled,
  'acceptanceRate': instance.acceptanceRate,
  'completionRate': instance.completionRate,
  'onTimeRate': instance.onTimeRate,
  'customerRating': instance.customerRating,
  'merchantRating': instance.merchantRating,
  'averageDeliveryTimeMinutes': instance.averageDeliveryTimeMinutes,
  'currentStreak': instance.currentStreak,
  'longestStreak': instance.longestStreak,
  'rank': instance.rank,
  'totalPartners': instance.totalPartners,
  'leaderboard': instance.leaderboard,
  'badges': instance.badges,
  'performanceScore': instance.performanceScore,
  'periodStart': instance.periodStart?.toIso8601String(),
  'periodEnd': instance.periodEnd?.toIso8601String(),
};

_$LeaderboardEntryImpl _$$LeaderboardEntryImplFromJson(
  Map<String, dynamic> json,
) => _$LeaderboardEntryImpl(
  rank: (json['rank'] as num).toInt(),
  partnerId: json['partnerId'] as String,
  partnerName: json['partnerName'] as String,
  photoUrl: json['photoUrl'] as String?,
  ordersDelivered: (json['ordersDelivered'] as num).toInt(),
  rating: (json['rating'] as num).toDouble(),
  earnings: (json['earnings'] as num).toDouble(),
);

Map<String, dynamic> _$$LeaderboardEntryImplToJson(
  _$LeaderboardEntryImpl instance,
) => <String, dynamic>{
  'rank': instance.rank,
  'partnerId': instance.partnerId,
  'partnerName': instance.partnerName,
  'photoUrl': instance.photoUrl,
  'ordersDelivered': instance.ordersDelivered,
  'rating': instance.rating,
  'earnings': instance.earnings,
};
