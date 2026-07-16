import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:delivery_mobile/shared/models/driver_info.dart';
import 'package:delivery_mobile/shared/models/route_info.dart';

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
    required double currentLatitude,
    required double currentLongitude,
  }) = _TrackingInfo;

  factory TrackingInfo.fromJson(Map<String, dynamic> json) =>
      _$TrackingInfoFromJson(json);
}
