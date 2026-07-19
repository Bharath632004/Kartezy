// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_timeline.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$OrderTimelineImpl _$$OrderTimelineImplFromJson(Map<String, dynamic> json) =>
    _$OrderTimelineImpl(
      id: json['id'] as String,
      orderId: json['orderId'] as String,
      status: json['status'] as String,
      description: json['description'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$$OrderTimelineImplToJson(_$OrderTimelineImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'orderId': instance.orderId,
      'status': instance.status,
      'description': instance.description,
      'timestamp': instance.timestamp.toIso8601String(),
      'updatedBy': instance.updatedBy,
    };
