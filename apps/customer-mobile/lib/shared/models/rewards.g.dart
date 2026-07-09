// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'rewards.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RewardPointsImpl _$$RewardPointsImplFromJson(Map<String, dynamic> json) =>
    _$RewardPointsImpl(
      points: (json['points'] as num).toInt(),
      expiresAt: json['expiresAt'] == null
          ? null
          : DateTime.parse(json['expiresAt'] as String),
    );

Map<String, dynamic> _$$RewardPointsImplToJson(_$RewardPointsImpl instance) =>
    <String, dynamic>{
      'points': instance.points,
      'expiresAt': instance.expiresAt?.toIso8601String(),
    };

_$RewardTransactionImpl _$$RewardTransactionImplFromJson(
        Map<String, dynamic> json) =>
    _$RewardTransactionImpl(
      id: json['id'] as String,
      type: json['type'] as String,
      points: (json['points'] as num).toInt(),
      description: json['description'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$$RewardTransactionImplToJson(
        _$RewardTransactionImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'points': instance.points,
      'description': instance.description,
      'timestamp': instance.timestamp.toIso8601String(),
    };

_$RewardLevelImpl _$$RewardLevelImplFromJson(Map<String, dynamic> json) =>
    _$RewardLevelImpl(
      level: json['level'] as String,
      minPoints: (json['minPoints'] as num).toInt(),
      benefits:
          (json['benefits'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$$RewardLevelImplToJson(_$RewardLevelImpl instance) =>
    <String, dynamic>{
      'level': instance.level,
      'minPoints': instance.minPoints,
      'benefits': instance.benefits,
    };
