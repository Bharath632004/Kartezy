import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:delivery_mobile/shared/models/driver_info.dart';
import 'package:delivery_mobile/shared/models/route_info.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'tracking_info.freezed.dart';
part 'tracking_info.g.dart';

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
    required LatLng currentLocation, // current location of the driver
  }) = _TrackingInfo;

  factory TrackingInfo.fromJson(Map<String, dynamic> json) =>
      _$TrackingInfoFromJson(json);
}