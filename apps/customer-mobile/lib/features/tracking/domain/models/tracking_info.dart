// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'tracking_info.freezed.dart';
part 'tracking_info.g.dart';

@freezed
class TrackingInfo with _$TrackingInfo {
  const factory TrackingInfo({
    required String orderId,
    required DriverInfo driver,
    required RouteInfo route,
    required String currentStatus,
    required DateTime lastUpdated,
    required double distanceRemaining,
    required Duration eta,
    @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
    required LatLng currentLocation,
  }) = _TrackingInfo;

  factory TrackingInfo.fromJson(Map<String, dynamic> json) =>
      _$TrackingInfoFromJson(json);
}

LatLng _latLngFromJson(Map<String, dynamic> json) =>
    LatLng(json['latitude'] as double, json['longitude'] as double);

Map<String, dynamic> _latLngToJson(LatLng latLng) => {
  'latitude': latLng.latitude,
  'longitude': latLng.longitude,
};
