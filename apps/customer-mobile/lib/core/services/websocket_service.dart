// lib/core/services/websocket_service.dart
// WebSocket client for real-time order tracking and status updates.
// Connects to the backend delivery-service and order-service WebSocket endpoints.

import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:customer_mobile/core/config/app_constants.dart';

/// Represents a real-time location update from a delivery partner.
class LocationUpdate {
  final String orderId;
  final double latitude;
  final double longitude;
  final DateTime timestamp;

  LocationUpdate({
    required this.orderId,
    required this.latitude,
    required this.longitude,
    required this.timestamp,
  });

  factory LocationUpdate.fromJson(Map<String, dynamic> json) {
    return LocationUpdate(
      orderId: json['orderId'] as String? ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Represents a real-time order status update.
class OrderStatusUpdate {
  final String orderId;
  final String status;
  final String description;
  final DateTime timestamp;

  OrderStatusUpdate({
    required this.orderId,
    required this.status,
    required this.description,
    required this.timestamp,
  });

  factory OrderStatusUpdate.fromJson(Map<String, dynamic> json) {
    return OrderStatusUpdate(
      orderId: json['orderId'] as String? ?? '',
      status: json['status'] as String? ?? '',
      description: json['description'] as String? ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Service that manages WebSocket connections for real-time tracking.
/// Connects to the delivery-service for location updates and
/// order-service for status updates.
class WebSocketTrackingService {
  WebSocketChannel? _locationChannel;
  WebSocketChannel? _statusChannel;
  StreamSubscription? _locationSubscription;
  StreamSubscription? _statusSubscription;

  final StreamController<LocationUpdate> _locationController =
      StreamController<LocationUpdate>.broadcast();
  final StreamController<OrderStatusUpdate> _statusController =
      StreamController<OrderStatusUpdate>.broadcast();

  /// Stream of live location updates from the delivery partner.
  Stream<LocationUpdate> get locationUpdates => _locationController.stream;

  /// Stream of live order status updates.
  Stream<OrderStatusUpdate> get statusUpdates => _statusController.stream;

  bool _isLocationConnected = false;
  bool _isStatusConnected = false;

  /// Connects to the delivery service WebSocket for live location tracking.
  void connectLocation(String orderId) {
    if (_isLocationConnected) return;

    try {
      final baseUrl = AppConstants.baseUrl
          .replaceFirst('http://', 'ws://')
          .replaceFirst('https://', 'wss://')
          .replaceFirst('/api', '');
      final wsUrl = '$baseUrl/ws/delivery/location/$orderId';

      _locationChannel = WebSocketChannel.connect(Uri.parse(wsUrl));

      _locationSubscription = _locationChannel!.stream.listen(
        (data) {
          try {
            final json = jsonDecode(data as String) as Map<String, dynamic>;
            final type = json['type'] as String?;

            if (type == 'LOCATION_UPDATE') {
              _locationController.add(LocationUpdate.fromJson(json));
            } else if (type == 'SUBSCRIBED') {
              _isLocationConnected = true;
            }
          } catch (e) {
            // Ignore malformed messages
          }
        },
        onError: (error) {
          _isLocationConnected = false;
          _locationController.addError(error);
        },
        onDone: () {
          _isLocationConnected = false;
        },
      );

      // Send subscribe message
      _locationChannel!.sink.add(jsonEncode({
        'type': 'SUBSCRIBE_CUSTOMER',
        'orderId': orderId,
      }));
    } catch (e) {
      _isLocationConnected = false;
      _locationController.addError(e);
    }
  }

  /// Connects to the order service WebSocket for live order status updates.
  void connectStatus(String orderId) {
    if (_isStatusConnected) return;

    try {
      final baseUrl = AppConstants.baseUrl
          .replaceFirst('http://', 'ws://')
          .replaceFirst('https://', 'wss://')
          .replaceFirst('/api', '');
      final wsUrl = '$baseUrl/ws/orders/status/$orderId';

      _statusChannel = WebSocketChannel.connect(Uri.parse(wsUrl));

      _statusSubscription = _statusChannel!.stream.listen(
        (data) {
          try {
            final json = jsonDecode(data as String) as Map<String, dynamic>;
            final type = json['type'] as String?;

            if (type == 'STATUS_UPDATE') {
              _statusController.add(OrderStatusUpdate.fromJson(json));
            } else if (type == 'SUBSCRIBED') {
              _isStatusConnected = true;
            }
          } catch (e) {
            // Ignore malformed messages
          }
        },
        onError: (error) {
          _isStatusConnected = false;
          _statusController.addError(error);
        },
        onDone: () {
          _isStatusConnected = false;
        },
      );

      // Send subscribe message
      _statusChannel!.sink.add(jsonEncode({
        'type': 'SUBSCRIBE',
        'orderId': orderId,
      }));
    } catch (e) {
      _isStatusConnected = false;
      _statusController.addError(e);
    }
  }

  /// Connects both location and status WebSockets for a given order.
  void connectAll(String orderId) {
    connectLocation(orderId);
    connectStatus(orderId);
  }

  /// Disconnects all WebSocket connections.
  void disconnect() {
    _locationSubscription?.cancel();
    _statusSubscription?.cancel();
    _locationChannel?.sink.close();
    _statusChannel?.sink.close();
    _isLocationConnected = false;
    _isStatusConnected = false;
  }

  /// Clean up resources.
  void dispose() {
    disconnect();
    _locationController.close();
    _statusController.close();
  }
}
