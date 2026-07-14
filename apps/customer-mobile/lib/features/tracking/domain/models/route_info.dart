import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'route_info.freezed.dart';
part 'route_info.g.dart';

@freezed
class RouteInfo with _$RouteInfo {
  const factory RouteInfo({
    required String id,
    @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
    required List<LatLng> polylineCoordinates,
    @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
    required LatLng startPoint,
    @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
    required LatLng endPoint,
    required double totalDistance,
    required Duration estimatedDuration,
  }) = _RouteInfo;

  factory RouteInfo.fromJson(Map<String, dynamic> json) =>
      _$RouteInfoFromJson(json);
}

List<LatLng> _latLngListFromJson(List<dynamic> json) =>
    json.map((e) => _latLngFromJson(e as Map<String, dynamic>)).toList();

List<Map<String, dynamic>> _latLngListToJson(List<LatLng> list) =>
    list.map((e) => _latLngToJson(e)).toList();

LatLng _latLngFromJson(Map<String, dynamic> json) =>
    LatLng(json['latitude'] as double, json['longitude'] as double);

Map<String, dynamic> _latLngToJson(LatLng latLng) => {
  'latitude': latLng.latitude,
  'longitude': latLng.longitude,
};
