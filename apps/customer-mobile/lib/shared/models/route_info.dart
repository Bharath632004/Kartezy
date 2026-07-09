import 'package:equatable/equatable.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class RouteInfo extends Equatable {
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

  RouteInfo copyWith({
    String? id,
    List<LatLng>? polylineCoordinates,
    LatLng? startPoint,
    LatLng? endPoint,
    double? totalDistance,
    Duration? estimatedDuration,
  }) {
    return RouteInfo(
      id: id ?? this.id,
      polylineCoordinates: polylineCoordinates ?? this.polylineCoordinates,
      startPoint: startPoint ?? this.startPoint,
      endPoint: endPoint ?? this.endPoint,
      totalDistance: totalDistance ?? this.totalDistance,
      estimatedDuration: estimatedDuration ?? this.estimatedDuration,
    );
  }

  factory RouteInfo.fromJson(Map<String, dynamic> json) {
    return RouteInfo(
      id: json['id'] as String,
      polylineCoordinates: (json['polylineCoordinates'] as List)
          .map((e) => LatLng(e[0] as double, e[1] as double))
          .toList(),
      startPoint: LatLng(
        json['startPoint'][0] as double,
        json['startPoint'][1] as double,
      ),
      endPoint: LatLng(
        json['endPoint'][0] as double,
        json['endPoint'][1] as double,
      ),
      totalDistance: (json['totalDistance'] as num).toDouble(),
      estimatedDuration: Duration(seconds: json['estimatedDuration'] as int),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'polylineCoordinates': polylineCoordinates
          .map((e) => [e.latitude, e.longitude])
          .toList(),
      'startPoint': [startPoint.latitude, startPoint.longitude],
      'endPoint': [endPoint.latitude, endPoint.longitude],
      'totalDistance': totalDistance,
      'estimatedDuration': estimatedDuration.inSeconds,
    };
  }

  @override
  List<Object?> get props => [
        id,
        polylineCoordinates,
        startPoint,
        endPoint,
        totalDistance,
        estimatedDuration,
      ];
}