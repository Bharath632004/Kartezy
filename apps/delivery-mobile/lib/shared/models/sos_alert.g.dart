// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sos_alert.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SosAlertImpl _$$SosAlertImplFromJson(Map<String, dynamic> json) =>
    _$SosAlertImpl(
      id: json['id'] as String,
      partnerId: json['partnerId'] as String,
      type: $enumDecode(_$SosTypeEnumMap, json['type']),
      status: $enumDecode(_$SosStatusEnumMap, json['status']),
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      message: json['message'] as String?,
      responderId: json['responderId'] as String?,
      acknowledgedAt: json['acknowledgedAt'] == null
          ? null
          : DateTime.parse(json['acknowledgedAt'] as String),
      resolvedAt: json['resolvedAt'] == null
          ? null
          : DateTime.parse(json['resolvedAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$SosAlertImplToJson(_$SosAlertImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'partnerId': instance.partnerId,
      'type': _$SosTypeEnumMap[instance.type]!,
      'status': _$SosStatusEnumMap[instance.status]!,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'message': instance.message,
      'responderId': instance.responderId,
      'acknowledgedAt': instance.acknowledgedAt?.toIso8601String(),
      'resolvedAt': instance.resolvedAt?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$SosTypeEnumMap = {
  SosType.emergency: 'emergency',
  SosType.unsafeLocation: 'unsafeLocation',
  SosType.vehicleBreakdown: 'vehicleBreakdown',
  SosType.accident: 'accident',
  SosType.health: 'health',
};

const _$SosStatusEnumMap = {
  SosStatus.active: 'active',
  SosStatus.acknowledged: 'acknowledged',
  SosStatus.resolved: 'resolved',
  SosStatus.cancelled: 'cancelled',
};
