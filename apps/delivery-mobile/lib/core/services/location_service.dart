import 'dart:async';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:kartezy_core/storage/secure_storage.dart';

/// Represents a GPS coordinate with metadata.
class GeoLocation {
  final double latitude;
  final double longitude;
  final double? accuracy;
  final double? speed;
  final double? heading;
  final DateTime timestamp;

  const GeoLocation({
    required this.latitude,
    required this.longitude,
    this.accuracy,
    this.speed,
    this.heading,
    required this.timestamp,
  });

  /// Calculate distance to another location in meters.
  double distanceTo(GeoLocation other) {
    return Geolocator.distanceBetween(
      latitude,
      longitude,
      other.latitude,
      other.longitude,
    );
  }

  /// Calculate bearing to another location in degrees.
  double bearingTo(GeoLocation other) {
    return Geolocator.bearingBetween(
      latitude,
      longitude,
      other.latitude,
      other.longitude,
    );
  }

  /// Estimate travel time based on distance and average speed.
  Duration estimatedTimeTo(GeoLocation other, {double avgSpeedKmh = 30}) {
    final distanceMeters = distanceTo(other);
    final distanceKm = distanceMeters / 1000;
    final hours = distanceKm / avgSpeedKmh;
    return Duration(milliseconds: (hours * 3600000).round());
  }

  Map<String, dynamic> toJson() => {
    'latitude': latitude,
    'longitude': longitude,
    'accuracy': accuracy,
    'speed': speed,
    'heading': heading,
    'timestamp': timestamp.toIso8601String(),
  };

  factory GeoLocation.fromJson(Map<String, dynamic> json) => GeoLocation(
    latitude: (json['latitude'] as num).toDouble(),
    longitude: (json['longitude'] as num).toDouble(),
    accuracy: json['accuracy'] as double?,
    speed: json['speed'] as double?,
    heading: json['heading'] as double?,
    timestamp: DateTime.parse(json['timestamp'] as String),
  );
}

/// Service that manages GPS location tracking for the delivery partner.
class LocationService {
  StreamSubscription<Position>? _positionSubscription;
  final _locationController = StreamController<GeoLocation>.broadcast();
  GeoLocation? _lastKnownLocation;
  Timer? _locationUpdateTimer;

  /// Stream of location updates.
  Stream<GeoLocation> get locationStream => _locationController.stream;

  /// Last known location.
  GeoLocation? get lastKnownLocation => _lastKnownLocation;

  /// Check and request location permissions.
  Future<bool> requestPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return false;
    }

    return true;
  }

  /// Get the current position.
  Future<GeoLocation?> getCurrentLocation() async {
    try {
      final hasPermission = await requestPermission();
      if (!hasPermission) return null;

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 15),
        ),
      );

      final location = GeoLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        speed: position.speed,
        heading: position.heading,
        timestamp: position.timestamp,
      );

      _lastKnownLocation = location;
      _locationController.add(location);

      // Persist for offline use
      await _persistLocation(location);

      return location;
    } catch (e) {
      return _lastKnownLocation;
    }
  }

  /// Start continuous location tracking.
  Future<void> startTracking({
    DistanceFilter distanceFilter = const DistanceFilter(meters: 50),
    LocationAccuracy accuracy = LocationAccuracy.high,
  }) async {
    final hasPermission = await requestPermission();
    if (!hasPermission) return;

    await _positionSubscription?.cancel();

    _positionSubscription =
        Geolocator.getPositionStream(
          locationSettings: LocationSettings(
            accuracy: accuracy,
            distanceFilter: distanceFilter.meters,
            timeLimit: const Duration(seconds: 30),
          ),
        ).listen(
          (position) {
            final location = GeoLocation(
              latitude: position.latitude,
              longitude: position.longitude,
              accuracy: position.accuracy,
              speed: position.speed,
              heading: position.heading,
              timestamp: position.timestamp,
            );
            _lastKnownLocation = location;
            _locationController.add(location);
            _persistLocation(location);
          },
          onError: (e) {
            // Handle location stream errors silently
          },
        );

    // Also set up a periodic timer as a fallback
    _locationUpdateTimer?.cancel();
    _locationUpdateTimer = Timer.periodic(
      const Duration(seconds: 10),
      (_) => getCurrentLocation(),
    );
  }

  /// Stop continuous location tracking.
  Future<void> stopTracking() async {
    await _positionSubscription?.cancel();
    _positionSubscription = null;
    _locationUpdateTimer?.cancel();
    _locationUpdateTimer = null;
  }

  /// Get the current Android-specific foreground service notification info.
  Future<bool> enableBackgroundMode() async {
    try {
      // Request background location permission
      final status = await Permission.locationAlways.request();
      return status.isGranted;
    } catch (e) {
      return false;
    }
  }

  /// Calculate distance between two points.
  static double distanceBetween(
    double startLat,
    double startLng,
    double endLat,
    double endLng,
  ) {
    return Geolocator.distanceBetween(startLat, startLng, endLat, endLng);
  }

  /// Calculate estimated travel time.
  static Duration estimateTravelTime({
    required double distanceMeters,
    double averageSpeedKmh = 30,
  }) {
    final distanceKm = distanceMeters / 1000;
    final hours = distanceKm / averageSpeedKmh;
    return Duration(milliseconds: (hours * 3600000).round());
  }

  /// Calculate ETA based on current position and destination.
  Duration? calculateETA({
    required GeoLocation current,
    required GeoLocation destination,
    double averageSpeedKmh = 30,
  }) {
    final distance = current.distanceTo(destination);
    return estimateTravelTime(
      distanceMeters: distance,
      averageSpeedKmh: averageSpeedKmh,
    );
  }

  /// Format distance for display.
  static String formatDistance(double meters) {
    if (meters < 1000) {
      return '${meters.round()} m';
    } else {
      final km = meters / 1000;
      return '${km.toStringAsFixed(1)} km';
    }
  }

  /// Format duration for display.
  static String formatDuration(Duration duration) {
    if (duration.inHours > 0) {
      return '${duration.inHours}h ${duration.inMinutes % 60}m';
    } else if (duration.inMinutes > 0) {
      return '${duration.inMinutes} min';
    } else {
      return '${duration.inSeconds} sec';
    }
  }

  /// Persist location for offline use.
  Future<void> _persistLocation(GeoLocation location) async {
    try {
      final secureStorage = SecureStorage();
      await secureStorage.write(
        key: 'last_known_location',
        value: location.toJson().toString(),
      );
    } catch (_) {}
  }

  /// Clean up resources.
  void dispose() {
    _positionSubscription?.cancel();
    _locationUpdateTimer?.cancel();
    _locationController.close();
  }
}

final locationServiceProvider = Provider<LocationService>((ref) {
  final service = LocationService();
  ref.onDispose(() => service.dispose());
  return service;
});
