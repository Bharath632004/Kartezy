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
}