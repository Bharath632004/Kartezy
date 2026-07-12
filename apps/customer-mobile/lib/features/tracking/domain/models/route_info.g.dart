// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route_info.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RouteInfoImpl _$$RouteInfoImplFromJson(Map<String, dynamic> json) =>
    _$RouteInfoImpl(
      id: json['id'] as String,
      polylineCoordinates:
          _latLngListFromJson(json['polylineCoordinates'] as List),
      startPoint: _latLngFromJson(json['startPoint'] as Map<String, dynamic>),
      endPoint: _latLngFromJson(json['endPoint'] as Map<String, dynamic>),
      totalDistance: (json['totalDistance'] as num).toDouble(),
      estimatedDuration:
          Duration(microseconds: (json['estimatedDuration'] as num).toInt()),
    );

Map<String, dynamic> _$$RouteInfoImplToJson(_$RouteInfoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'polylineCoordinates': _latLngListToJson(instance.polylineCoordinates),
      'startPoint': _latLngToJson(instance.startPoint),
      'endPoint': _latLngToJson(instance.endPoint),
      'totalDistance': instance.totalDistance,
      'estimatedDuration': instance.estimatedDuration.inMicroseconds,
    };
