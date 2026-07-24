// lib/features/tracking/data/datasource/tracking_remote_data_source_impl.dart
// Uses WebSocket for real-time location streaming and HTTP REST for driver/route data.

import 'dart:async';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:customer_mobile/features/tracking/data/datasource/tracking_remote_data_source.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class TrackingRemoteDataSourceImpl implements TrackingRemoteDataSource {
  final Dio dio;
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;

  TrackingRemoteDataSourceImpl(this.dio);

  @override
  Stream<TrackingInfo> getOrderTracking(String orderId) async* {
    // First, fetch the initial tracking data via REST
    try {
      final driverFuture = getDriverInfo(orderId);
      final routeFuture = getRouteInfo(orderId);
      final results = await Future.wait([driverFuture, routeFuture]);
      final driver = results[0] as DriverInfo;
      final route = results[1] as RouteInfo;

      // Yield initial tracking info
      yield TrackingInfo(
        orderId: orderId,
        driver: driver,
        route: route,
        currentStatus: 'PENDING',
        lastUpdated: DateTime.now(),
        distanceRemaining: route.totalDistance,
        eta: route.estimatedDuration,
        currentLocation: route.startPoint,
      );
    } catch (e) {
      // Initial fetch failed, yield nothing yet; WebSocket might still work
    }

    // Then connect to WebSocket for live updates
    try {
      final baseUrl = dio.options.baseUrl
          .replaceFirst('http://', 'ws://')
          .replaceFirst('https://', 'wss://')
          .replaceFirst('/api', '');
      final wsUrl = '$baseUrl/ws/delivery/location/$orderId';

      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));

      // Send subscribe message
      _channel!.sink.add(
        jsonEncode({'type': 'SUBSCRIBE_CUSTOMER', 'orderId': orderId}),
      );

      // Listen for location updates
      await for (final data in _channel!.stream) {
        try {
          final json = jsonDecode(data as String) as Map<String, dynamic>;
          final type = json['type'] as String?;

          if (type == 'LOCATION_UPDATE') {
            final lat = (json['latitude'] as num?)?.toDouble() ?? 0.0;
            final lng = (json['longitude'] as num?)?.toDouble() ?? 0.0;
            final loc = LatLng(lat, lng);

            // Yield updated tracking info (driver/route kept from initial load)
            yield TrackingInfo(
              orderId: orderId,
              driver: DriverInfo(
                id: '',
                name: 'Delivery Partner',
                photoUrl: null,
                vehicleNumber: '',
                vehicleType: '',
                rating: 0.0,
                phoneNumber: '',
              ),
              route: RouteInfo(
                id: '',
                polylineCoordinates: [loc],
                startPoint: loc,
                endPoint: loc,
                totalDistance: 0,
                estimatedDuration: const Duration(minutes: 15),
              ),
              currentStatus: 'OUT_FOR_DELIVERY',
              lastUpdated: DateTime.now(),
              distanceRemaining: 0,
              eta: const Duration(minutes: 15),
              currentLocation: loc,
            );
          }
        } catch (_) {
          // Skip malformed messages
        }
      }
    } catch (e) {
      // Fallback: try SSE/HTTP streaming
      yield* _httpStreamFallback(orderId);
    }
  }

  /// Fallback HTTP streaming in case WebSocket is unavailable.
  Stream<TrackingInfo> _httpStreamFallback(String orderId) async* {
    try {
      final response = await dio.get(
        '/tracking/$orderId',
        options: Options(
          responseType: ResponseType.stream,
          validateStatus: (status) => true,
        ),
      );

      await for (var event
          in response.data.stream
              .transform(utf8.decoder)
              .transform(const LineSplitter())) {
        if (event.isNotEmpty) {
          try {
            final Map<String, dynamic> json = jsonDecode(event);
            yield TrackingInfo.fromJson(json);
          } catch (_) {
            // Skip invalid JSON lines
          }
        }
      }
    } catch (e) {
      yield* Stream.error(e);
    }
  }

  @override
  Future<DriverInfo> getDriverInfo(String orderId) async {
    final response = await dio.get('/delivery/$orderId/driver');
    return DriverInfo.fromJson(response.data);
  }

  @override
  Future<RouteInfo> getRouteInfo(String orderId) async {
    final response = await dio.get('/delivery/$orderId/route');
    return RouteInfo.fromJson(response.data);
  }

  /// Disconnect the WebSocket connection.
  void disconnect() {
    _subscription?.cancel();
    _channel?.sink.close();
    _channel = null;
  }
}
