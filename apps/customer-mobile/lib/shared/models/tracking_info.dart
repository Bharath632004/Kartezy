import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:customer_mobile/shared/models/driver_info.dart';
import 'package:customer_mobile/shared/models/route_info.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:json_annotation/json_annotation.dart';

part 'tracking_info.freezed.dart';
part 'tracking_info.g.dart';

class LatLngJsonConverter implements JsonConverter<LatLng, Map<String, dynamic>> {
  const LatLngJsonConverter();

  @override
  LatLng fromJson(Map<String, dynamic> json) {
    return LatLng(json['latitude'] as double, json['longitude'] as double);
  }

  @override
  Map<String, dynamic> toJson(LatLng object) => {
        'latitude': object.latitude,
        'longitude': object.longitude,
      };
}

@freezed
class TrackingInfo with _$TrackingInfo, EquatableMixin {
  const factory TrackingInfo({
    required String orderId,
    required DriverInfo driver,
    required RouteInfo route,
    required String currentStatus,
    required DateTime lastUpdated,
    required double distanceRemaining, // in kilometers
    required Duration eta, // estimated time of arrival
    @LatLngJsonConverter() required LatLng currentLocation, // current location of the driver
  }) = _TrackingInfo;

  factory TrackingInfo.fromJson(Map<String, dynamic> json) =>
      _$TrackingInfoFromJson(json);
}