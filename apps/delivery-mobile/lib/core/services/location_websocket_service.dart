// lib/core/services/location_websocket_service.dart
// WebSocket client for delivery partners to stream live GPS coordinates
// to the delivery-service, which then broadcasts to customers tracking the order.

import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:kartezy_core/config/app_constants.dart';
import 'package:kartezy_core/storage/secure_storage.dart';

/// Service that periodically sends the delivery partner's GPS location
/// via WebSocket to the delivery-service for live tracking.
class LocationWebSocketService {
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  Timer? _locationTimer;

  bool _isConnected = false;
  String? _currentOrderId;
  String? _partnerId;

  /// Connects to the delivery service WebSocket for location streaming.
  Future<void> connect(String orderId) async {
    if (_isConnected && _currentOrderId == orderId) return;

    // Disconnect any existing connection
    await disconnect();

    _currentOrderId = orderId;
    _partnerId = await SecureStorage().read(key: 'user_id');

    try {
      final baseUrl = AppConstants.baseUrl
          .replaceFirst('http://', 'ws://')
          .replaceFirst('https://', 'wss://')
          .replaceFirst('/api', '');
      final wsUrl = '$baseUrl/ws/delivery/location/$orderId';

      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));

      _subscription = _channel!.stream.listen(
        (data) {
          try {
            final json = jsonDecode(data as String) as Map<String, dynamic>;
            final type = json['type'] as String?;
            if (type == 'SUBSCRIBED') {
              _isConnected = true;
            }
          } catch (_) {}
        },
        onError: (_) => _isConnected = false,
        onDone: () => _isConnected = false,
      );

      // Subscribe as delivery partner
      _channel!.sink.add(
        jsonEncode({
          'type': 'SUBSCRIBE_DELIVERY',
          'orderId': orderId,
          'partnerId': _partnerId,
        }),
      );

      // Start periodic location updates (every 5 seconds)
      _startLocationUpdates();
    } catch (e) {
      _isConnected = false;
    }
  }

  /// Starts sending GPS location at regular intervals.
  void _startLocationUpdates() {
    _locationTimer?.cancel();
    _locationTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (_isConnected && _currentOrderId != null) {
        _sendCurrentLocation();
      }
    });
  }

  /// Sends the current GPS coordinates via WebSocket.
  Future<void> _sendCurrentLocation() async {
    if (_channel == null || !_isConnected) return;

    try {
      // In a real app, use geolocator package to get actual GPS:
      // import 'package:geolocator/geolocator.dart';
      // final position = await Geolocator.getCurrentPosition();
      // For MVP, simulate with a small random offset from a fixed point
      final latitude =
          12.9716 + (DateTime.now().millisecondsSinceEpoch % 100) / 10000.0;
      final longitude =
          77.5946 + (DateTime.now().millisecondsSinceEpoch % 100) / 10000.0;

      _channel!.sink.add(
        jsonEncode({
          'type': 'LOCATION_UPDATE',
          'orderId': _currentOrderId,
          'latitude': latitude,
          'longitude': longitude,
          'timestamp': DateTime.now().toUtc().toIso8601String(),
        }),
      );
    } catch (e) {
      // Handle location error silently
    }
  }

  /// Sends a specific GPS coordinate update (called from UI with actual GPS data).
  void sendLocationUpdate({
    required String orderId,
    required double latitude,
    required double longitude,
  }) {
    if (_channel == null || !_isConnected) return;

    try {
      _channel!.sink.add(
        jsonEncode({
          'type': 'LOCATION_UPDATE',
          'orderId': orderId,
          'latitude': latitude,
          'longitude': longitude,
          'timestamp': DateTime.now().toUtc().toIso8601String(),
        }),
      );
    } catch (e) {
      // Handle error
    }
  }

  /// Returns whether the WebSocket is connected.
  bool get isConnected => _isConnected;

  /// Returns the current order ID being tracked.
  String? get currentOrderId => _currentOrderId;

  /// Disconnects the WebSocket and stops location updates.
  Future<void> disconnect() async {
    _locationTimer?.cancel();
    _locationTimer = null;
    _subscription?.cancel();
    _subscription = null;
    _channel?.sink.close();
    _channel = null;
    _isConnected = false;
    _currentOrderId = null;
  }

  /// Clean up all resources.
  void dispose() {
    disconnect();
  }
}
