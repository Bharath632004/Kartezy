import 'dart:async';
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:kartezy_core/storage/secure_storage.dart';

/// Represents a pending sync operation.
class PendingSyncOperation {
  final String id;
  final String endpoint;
  final String method;
  final Map<String, dynamic>? body;
  final DateTime createdAt;
  int retryCount;

  PendingSyncOperation({
    required this.id,
    required this.endpoint,
    required this.method,
    this.body,
    required this.createdAt,
    this.retryCount = 0,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'endpoint': endpoint,
    'method': method,
    'body': body,
    'createdAt': createdAt.toIso8601String(),
    'retryCount': retryCount,
  };

  factory PendingSyncOperation.fromJson(Map<String, dynamic> json) =>
      PendingSyncOperation(
        id: json['id'] as String,
        endpoint: json['endpoint'] as String,
        method: json['method'] as String,
        body: json['body'] as Map<String, dynamic>?,
        createdAt: DateTime.parse(json['createdAt'] as String),
        retryCount: json['retryCount'] as int? ?? 0,
      );
}

/// Manages offline-first operations with automatic retry synchronization.
class OfflineSyncService {
  final List<PendingSyncOperation> _pendingOperations = [];
  final _connectivity = Connectivity();
  final Dio _dio;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;
  final _syncController = StreamController<bool>.broadcast();
  bool _isSyncing = false;

  OfflineSyncService(this._dio);

  Stream<bool> get syncStatus => _syncController.stream;
  List<PendingSyncOperation> get pendingOperations =>
      List.unmodifiable(_pendingOperations);

  /// Initialize the service and start listening for connectivity changes.
  void init() {
    _connectivitySubscription = _connectivity.onConnectivityChanged.listen((
      results,
    ) {
      if (results.any((r) => r != ConnectivityResult.none)) {
        syncPendingOperations();
      }
    });

    // Try to load any persisted pending operations
    _loadPendingOperations();
  }

  /// Queue an operation for sync when online.
  Future<void> queueOperation(PendingSyncOperation operation) async {
    _pendingOperations.add(operation);
    await _persistPendingOperations();

    // Try to sync immediately
    final connectivityResult = await _connectivity.checkConnectivity();
    if (connectivityResult.any((r) => r != ConnectivityResult.none)) {
      syncPendingOperations();
    }
  }

  /// Sync all pending operations when back online.
  Future<void> syncPendingOperations() async {
    if (_isSyncing || _pendingOperations.isEmpty) return;

    _isSyncing = true;
    _syncController.add(true);

    final toRemove = <PendingSyncOperation>[];

    for (final operation in _pendingOperations) {
      try {
        switch (operation.method.toUpperCase()) {
          case 'POST':
            await _dio.post(operation.endpoint, data: operation.body);
            break;
          case 'PUT':
            await _dio.put(operation.endpoint, data: operation.body);
            break;
          case 'PATCH':
            await _dio.patch(operation.endpoint, data: operation.body);
            break;
          case 'DELETE':
            await _dio.delete(operation.endpoint, data: operation.body);
            break;
        }
        toRemove.add(operation);
      } catch (e) {
        operation.retryCount++;
        if (operation.retryCount >= 5) {
          toRemove.add(operation);
        }
      }
    }

    for (final op in toRemove) {
      _pendingOperations.remove(op);
    }

    await _persistPendingOperations();

    _isSyncing = false;
    _syncController.add(false);
  }

  Future<void> _persistPendingOperations() async {
    try {
      final secureStorage = SecureStorage();
      final jsonList = _pendingOperations.map((op) => op.toJson()).toList();
      await secureStorage.write(
        key: 'pending_sync_operations',
        value: jsonEncode(jsonList),
      );
    } catch (_) {}
  }

  Future<void> _loadPendingOperations() async {
    try {
      final secureStorage = SecureStorage();
      final data = await secureStorage.read(key: 'pending_sync_operations');
      if (data != null && data.isNotEmpty) {
        final jsonList = jsonDecode(data) as List;
        _pendingOperations.clear();
        _pendingOperations.addAll(
          jsonList.map(
            (j) => PendingSyncOperation.fromJson(j as Map<String, dynamic>),
          ),
        );
      }
    } catch (_) {}
  }

  /// Clean up resources.
  void dispose() {
    _connectivitySubscription?.cancel();
    _syncController.close();
  }
}

final offlineSyncServiceProvider = Provider<OfflineSyncService>((ref) {
  final dio = ref.read(dioProvider);
  final service = OfflineSyncService(dio);
  service.init();
  ref.onDispose(() => service.dispose());
  return service;
});
