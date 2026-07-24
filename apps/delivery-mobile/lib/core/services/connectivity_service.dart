import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

/// Network connectivity status.
enum ConnectivityStatus {
  wifi,
  mobile,
  ethernet,
  bluetooth,
  vpn,
  none,
  unknown,
}

/// Service that monitors network connectivity status.
class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  final _connectivityController =
      StreamController<ConnectivityStatus>.broadcast();
  StreamSubscription<List<ConnectivityResult>>? _subscription;
  ConnectivityStatus _currentStatus = ConnectivityStatus.unknown;

  Stream<ConnectivityStatus> get connectivityStream =>
      _connectivityController.stream;
  ConnectivityStatus get currentStatus => _currentStatus;
  bool get isConnected => _currentStatus != ConnectivityStatus.none;

  /// Initialize connectivity monitoring.
  void init() {
    // Check initial status
    checkConnectivity();

    // Listen for changes
    _subscription = _connectivity.onConnectivityChanged.listen((results) {
      final status = _mapResult(results);
      if (status != _currentStatus) {
        _currentStatus = status;
        _connectivityController.add(status);
        debugPrint('Connectivity changed: $status');
      }
    });
  }

  /// Check current connectivity status.
  Future<ConnectivityStatus> checkConnectivity() async {
    try {
      final results = await _connectivity.checkConnectivity();
      final status = _mapResult(results);
      _currentStatus = status;
      _connectivityController.add(status);
      return status;
    } catch (e) {
      _currentStatus = ConnectivityStatus.unknown;
      return ConnectivityStatus.unknown;
    }
  }

  ConnectivityStatus _mapResult(List<ConnectivityResult> results) {
    if (results.isEmpty || results.contains(ConnectivityResult.none)) {
      return ConnectivityStatus.none;
    }
    if (results.contains(ConnectivityResult.wifi)) {
      return ConnectivityStatus.wifi;
    }
    if (results.contains(ConnectivityResult.mobile)) {
      return ConnectivityStatus.mobile;
    }
    if (results.contains(ConnectivityResult.ethernet)) {
      return ConnectivityStatus.ethernet;
    }
    if (results.contains(ConnectivityResult.bluetooth)) {
      return ConnectivityStatus.bluetooth;
    }
    if (results.contains(ConnectivityResult.vpn)) {
      return ConnectivityStatus.vpn;
    }
    return ConnectivityStatus.unknown;
  }

  /// Wait for connectivity to be restored.
  Future<void> waitForConnection({
    Duration timeout = const Duration(minutes: 2),
  }) async {
    if (isConnected) return;

    final completer = Completer<void>();
    final timer = Timer(timeout, () {
      if (!completer.isCompleted) completer.complete();
    });

    final subscription = connectivityStream.listen((status) {
      if (status != ConnectivityStatus.none && !completer.isCompleted) {
        timer.cancel();
        completer.complete();
      }
    });

    await completer.future;
    await subscription.cancel();
  }

  void dispose() {
    _subscription?.cancel();
    _connectivityController.close();
  }
}

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  final service = ConnectivityService();
  service.init();
  ref.onDispose(() => service.dispose());
  return service;
});
