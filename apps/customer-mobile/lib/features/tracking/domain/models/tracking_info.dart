import 'package:customer_mobile/features/order/domain/models/order.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class TrackingInfo {
  final String orderId;
  final DriverInfo driver;
  final RouteInfo route;
  final String currentStatus;
  final DateTime lastUpdated;
  final double distanceRemaining; // in kilometers
  final Duration eta; // estimated time of arrival
  final LatLng currentLocation; // current location of the driver

  const TrackingInfo({
    required this.orderId,
    required this.driver,
    required this.route,
    required this.currentStatus,
    required this.lastUpdated,
    required this.distanceRemaining,
    required this.eta,
    required this.currentLocation,
  });

  // Factory method to create from JSON (if needed from API)
  factory TrackingInfo.fromJson(Map<String, dynamic> json) {
    return TrackingInfo(
      orderId: json['orderId'] as String,
      driver: DriverInfo.fromJson(json['driver'] as Map<String, dynamic>),
      route: RouteInfo.fromJson(json['route'] as Map<String, dynamic>),
      currentStatus: json['currentStatus'] as String,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
      distanceRemaining: (json['distanceRemaining'] as num).toDouble(),
      eta: Duration(seconds: json['eta'] as int),
      currentLocation: LatLng(
        (json['currentLocation']['latitude'] as double),
        (json['currentLocation']['longitude'] as double),
      ),
    );
  }

  Map<String, dynamic> toJson() => {
        'orderId': orderId,
        'driver': driver.toJson(),
        'route': route.toJson(),
        'currentStatus': currentStatus,
        'lastUpdated': lastUpdated.toIso8601String(),
        'distanceRemaining': distanceRemaining,
        'eta': eta.inSeconds,
        'currentLocation': {
          'latitude': currentLocation.latitude,
          'longitude': currentLocation.longitude,
        },
      };
}