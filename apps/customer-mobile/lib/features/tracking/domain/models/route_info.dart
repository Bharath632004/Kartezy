import 'package:google_maps_flutter/google_maps_flutter.dart';

class RouteInfo {
  final String id;
  final List<LatLng> polylineCoordinates;
  final LatLng startPoint;
  final LatLng endPoint;
  final double totalDistance; // in kilometers
  final Duration estimatedDuration;

  const RouteInfo({
    required this.id,
    required this.polylineCoordinates,
    required this.startPoint,
    required this.endPoint,
    required this.totalDistance,
    required this.estimatedDuration,
  });

  factory RouteInfo.fromJson(Map<String, dynamic> json) {
    return RouteInfo(
      id: json['id'] as String,
      polylineCoordinates: (json['polylineCoordinates'] as List<dynamic>)
          .map(
            (e) =>
                LatLng((e['latitude'] as double), (e['longitude'] as double)),
          )
          .toList(),
      startPoint: LatLng(
        (json['startPoint']['latitude'] as double),
        (json['startPoint']['longitude'] as double),
      ),
      endPoint: LatLng(
        (json['endPoint']['latitude'] as double),
        (json['endPoint']['longitude'] as double),
      ),
      totalDistance: (json['totalDistance'] as num).toDouble(),
      estimatedDuration: Duration(seconds: (json['estimatedDuration'] as int)),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'polylineCoordinates': polylineCoordinates
        .map((e) => {'latitude': e.latitude, 'longitude': e.longitude})
        .toList(),
    'startPoint': {
      'latitude': startPoint.latitude,
      'longitude': startPoint.longitude,
    },
    'endPoint': {
      'latitude': endPoint.latitude,
      'longitude': endPoint.longitude,
    },
    'totalDistance': totalDistance,
    'estimatedDuration': estimatedDuration.inSeconds,
  };
}
