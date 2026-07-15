// lib/features/navigation/data/datasource/navigation_remote_data_source.dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:kartezy_core/config/app_constants.dart';
import 'package:delivery_mobile/shared/models/route_info.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class NavigationRemoteDataSource {
  final Dio _dio;

  NavigationRemoteDataSource(this._dio);

  List<LatLng> _decodePolyline(String encoded) {
    List<LatLng> poly = [];
    int index = 0, len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      LatLng p = LatLng((lat / 1E5), (lng / 1E5));
      poly.add(p);
    }

    return poly;
  }

  Future<List<RouteInfo>> getDirections(
    String origin,
    String destination,
    bool alternatives,
  ) async {
    final response = await _dio.get(
      'https://maps.googleapis.com/maps/api/directions/json',
      queryParameters: {
        'origin': origin,
        'destination': destination,
        'alternatives': alternatives.toString(),
        'key': AppConstants.googleMapsApiKey,
        'mode': 'driving',
        'units': 'metric',
      },
    );

    final Map<String, dynamic> data = response.data;
    if (data['status'] != 'OK') {
      throw Exception('Directions request failed: ${data['status']}');
    }

    List<RouteInfo> routes = [];
    for (var route in data['routes']) {
      String? polylinePoints;
      if (route['overview_polyline'] != null &&
          route['overview_polyline']['points'] != null) {
        polylinePoints = route['overview_polyline']['points'];
      }

      List<LatLng> polyPoints = [];
      if (polylinePoints != null && polylinePoints.isNotEmpty) {
        polyPoints = _decodePolyline(polylinePoints);
      }

      double totalDistance = 0;
      int totalDuration = 0;
      LatLng? startPoint;
      LatLng? endPoint;

      for (var leg in route['legs']) {
        totalDistance += leg['distance']['value'];
        totalDuration += leg['duration']['value'];
        if (startPoint == null) {
          startPoint = LatLng(
            leg['start_location']['lat'],
            leg['start_location']['lng'],
          );
        }
        endPoint = LatLng(
          leg['end_location']['lat'],
          leg['end_location']['lng'],
        );
      }

      RouteInfo routeInfo = RouteInfo(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        polylineCoordinates: polyPoints,
        startPoint: startPoint!,
        endPoint: endPoint!,
        totalDistance: totalDistance / 1000.0, // Convert to km
        estimatedDuration: Duration(seconds: totalDuration),
      );
      routes.add(routeInfo);
    }

    return routes;
  }

  Future<Position> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Test if location services are enabled.
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception(
        'Location permissions are permanently denied, we cannot request permissions.',
      );
    }

    return await Geolocator.getCurrentPosition();
  }

  Stream<Position> getLocationStream({
    LocationAccuracy accuracy = LocationAccuracy.high,
  }) {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: accuracy,
        distanceFilter: 10,
      ),
    );
  }

  Future<void> cancelRequest() {
    // Implement cancellation if needed
    return Future.value();
  }
}

/// Provider for navigation remote data source
final navigationRemoteDataSourceProvider = Provider<NavigationRemoteDataSource>(
  (ref) {
    final dio = ref.read(dioProvider);
    return NavigationRemoteDataSource(dio);
  },
);
