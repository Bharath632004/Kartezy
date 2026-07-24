import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:geolocator/geolocator.dart';
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:kartezy_core/config/app_constants.dart';
import 'dart:convert';

/// Background service for continuous location updates during active deliveries.
class BackgroundLocationService {
  final FlutterBackgroundService _service = FlutterBackgroundService();
  bool _isRunning = false;

  bool get isRunning => _isRunning;

  /// Initialize and configure the background service.
  Future<bool> init() async {
    try {
      await _service.configure(
        androidConfiguration: AndroidConfiguration(
          onStart: _onStart,
          autoStart: false,
          isForegroundMode: true,
          foregroundServiceNotificationId: 888,
          initialNotificationTitle: 'Kartezy Delivery',
          initialNotificationContent: 'Location tracking active',
        ),
        iosConfiguration: IosConfiguration(
          autoStart: false,
          onForeground: _onStart,
          onBackground: _onIosBackground,
        ),
      );
      return true;
    } catch (e) {
      debugPrint('Background service init error: $e');
      return false;
    }
  }

  /// Start the background service for an active order.
  Future<void> start(String orderId) async {
    if (_isRunning) return;

    try {
      final service = await _service.startService();
      service.invoke('startTracking', {'orderId': orderId});
      _isRunning = true;
    } catch (e) {
      debugPrint('Background service start error: $e');
    }
  }

  /// Stop the background service.
  Future<void> stop() async {
    try {
      _service.invoke('stopService');
      _isRunning = false;
    } catch (e) {
      debugPrint('Background service stop error: $e');
    }
  }
}

/// Background service entry point (must be top-level function).
@pragma('vm:entry-point')
void _onStart(ServiceInstance service) async {
  DartPluginRegistrant.ensureInitialized();

  if (service is AndroidServiceInstance) {
    service.setAsForegroundService();

    service.on('setAsForeground').listen((_) {
      service.setAsForegroundService();
    });

    service.on('setAsBackground').listen((_) {
      service.setAsBackgroundService();
    });
  }

  service.on('stopService').listen((_) {
    service.stopSelf();
  });

  service.on('startTracking').listen((event) async {
    final orderId = event?['orderId'] as String? ?? '';
    await _trackLocation(service, orderId);
  });
}

/// Track location in the background and send via WebSocket.
Future<void> _trackLocation(ServiceInstance service, String orderId) async {
  WebSocketChannel? channel;
  Timer? timer;

  try {
    final secureStorage = SecureStorage();
    final baseUrl = AppConstants.baseUrl
        .replaceFirst('http://', 'ws://')
        .replaceFirst('https://', 'wss://')
        .replaceFirst('/api', '');
    final wsUrl = '$baseUrl/ws/delivery/location/$orderId';

    channel = WebSocketChannel.connect(Uri.parse(wsUrl));

    channel.stream.listen((data) {}, onError: (_) {}, onDone: () {});

    // Subscribe as delivery partner
    channel.sink.add(
      jsonEncode({'type': 'SUBSCRIBE_DELIVERY', 'orderId': orderId}),
    );

    // Send location every 10 seconds
    timer = Timer.periodic(const Duration(seconds: 10), (_) async {
      try {
        final position = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.high,
            timeLimit: Duration(seconds: 10),
          ),
        );

        channel?.sink.add(
          jsonEncode({
            'type': 'LOCATION_UPDATE',
            'orderId': orderId,
            'latitude': position.latitude,
            'longitude': position.longitude,
            'timestamp': DateTime.now().toUtc().toIso8601String(),
          }),
        );

        if (service is AndroidServiceInstance) {
          service.setForegroundNotificationInfo(
            title: 'Kartezy Delivery',
            content: 'Tracking active for order #$orderId',
          );
        }
      } catch (_) {}
    });
  } catch (e) {
    debugPrint('Background tracking error: $e');
  }

  service.on('stopService').listen((_) {
    timer?.cancel();
    channel?.sink.close();
    service.stopSelf();
  });
}

/// iOS background fetch handler.
Future<bool> _onIosBackground(ServiceInstance service) async {
  return true;
}

final backgroundLocationServiceProvider = Provider<BackgroundLocationService>((
  ref,
) {
  final service = BackgroundLocationService();
  service.init();
  return service;
});
