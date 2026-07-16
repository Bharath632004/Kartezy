// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tracking_info.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TrackingInfoImpl _$$TrackingInfoImplFromJson(Map<String, dynamic> json) =>
    _$TrackingInfoImpl(
      orderId: json['orderId'] as String,
      driver: DriverInfo.fromJson(json['driver'] as Map<String, dynamic>),
      route: RouteInfo.fromJson(json['route'] as Map<String, dynamic>),
      currentStatus: json['currentStatus'] as String,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
      distanceRemaining: (json['distanceRemaining'] as num).toDouble(),
      eta: Duration(microseconds: (json['eta'] as num).toInt()),
      currentLatitude: (json['currentLatitude'] as num).toDouble(),
      currentLongitude: (json['currentLongitude'] as num).toDouble(),
    );

Map<String, dynamic> _$$TrackingInfoImplToJson(_$TrackingInfoImpl instance) =>
    <String, dynamic>{
      'orderId': instance.orderId,
      'driver': instance.driver,
      'route': instance.route,
      'currentStatus': instance.currentStatus,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
      'distanceRemaining': instance.distanceRemaining,
      'eta': instance.eta.inMicroseconds,
      'currentLatitude': instance.currentLatitude,
      'currentLongitude': instance.currentLongitude,
    };
