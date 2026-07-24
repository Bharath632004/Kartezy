import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:merchant_mobile/core/logger/logger_service.dart';

/// Represents a pending operation to be synced when online.
class PendingSyncOperation {
  final String id;
  final String type; // 'create', 'update', 'delete'
  final String entity; // 'product', 'inventory', 'order', etc.
  final String entityId;
  final Map<String, dynamic> data;
  final DateTime createdAt;
  int retryCount;

  PendingSyncOperation({
    required this.id,
    required this.type,
    required this.entity,
    required this.entityId,
    required this.data,
    required this.createdAt,
    this.retryCount = 0,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'entity': entity,
    'entity_id': entityId,
    'data': data,
    'created_at': createdAt.toIso8601String(),
    'retry_count': retryCount,
  };

  factory PendingSyncOperation.fromJson(Map<String, dynamic> json) =>
      PendingSyncOperation(
        id: json['id'] as String,
        type: json['type'] as String,
        entity: json['entity'] as String,
        entityId: json['entity_id'] as String,
        data: Map<String, dynamic>.from(json['data'] as Map),
        createdAt: DateTime.parse(json['created_at'] as String),
        retryCount: json['retry_count'] as int? ?? 0,
      );
}

/// Service for managing offline data synchronization.
class OfflineSyncService {
  static const String _syncBoxName = 'pending_sync';
  static const int _maxRetries = 5;

  late Box<dynamic> _syncBox;
  final Connectivity _connectivity = Connectivity();
  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;
  bool _isSyncing = false;
  bool _isInitialized = false;

  /// Initialize the offline sync service.
  Future<void> init() async {
    if (_isInitialized) return;
    _syncBox = await Hive.openBox(_syncBoxName);
    _isInitialized = true;

    // Listen for connectivity changes
    _connectivitySubscription = _connectivity.onConnectivityChanged.listen((
      results,
    ) {
      if (results.any(
        (r) =>
            r == ConnectivityResult.wifi ||
            r == ConnectivityResult.mobile ||
            r == ConnectivityResult.ethernet,
      )) {
        // Became online - try to sync pending operations
        syncPendingOperations();
      }
    });

    // Try to sync any pending operations on startup
    syncPendingOperations();
  }

  /// Queue an operation for later sync when offline.
  Future<void> queueOperation({
    required String type,
    required String entity,
    required String entityId,
    required Map<String, dynamic> data,
  }) async {
    if (!_isInitialized) await init();

    final operation = PendingSyncOperation(
      id: '${entity}_${entityId}_${DateTime.now().millisecondsSinceEpoch}',
      type: type,
      entity: entity,
      entityId: entityId,
      data: data,
      createdAt: DateTime.now(),
    );

    await _syncBox.put(operation.id, operation.toJson());
    LoggerService.instance.i(
      'Queued sync operation: ${operation.type} ${operation.entity}/${operation.entityId}',
    );
  }

  /// Check if there are pending sync operations.
  Future<bool> hasPendingOperations() async {
    if (!_isInitialized) await init();
    return _syncBox.isNotEmpty;
  }

  /// Get all pending sync operations.
  Future<List<PendingSyncOperation>> getPendingOperations() async {
    if (!_isInitialized) await init();
    final values = _syncBox.values;
    return values
        .map((v) => PendingSyncOperation.fromJson(Map<String, dynamic>.from(v)))
        .toList();
  }

  /// Sync all pending operations with the server.
  Future<void> syncPendingOperations() async {
    if (_isSyncing) return;
    if (!_isInitialized) await init();

    // Check connectivity
    final connectivityResult = await _connectivity.checkConnectivity();
    final isOnline = connectivityResult.any(
      (r) =>
          r == ConnectivityResult.wifi ||
          r == ConnectivityResult.mobile ||
          r == ConnectivityResult.ethernet,
    );

    if (!isOnline) return;

    _isSyncing = true;
    LoggerService.instance.i('Starting offline sync...');

    try {
      final operations = await getPendingOperations();

      for (final operation in operations) {
        if (operation.retryCount >= _maxRetries) {
          // Skip operations that have exceeded retry limit
          LoggerService.instance.w(
            'Sync operation exceeded retry limit: ${operation.id}',
          );
          await _syncBox.delete(operation.id);
          continue;
        }

        try {
          // Execute the sync operation
          await _executeSyncOperation(operation);
          // Remove from queue on success
          await _syncBox.delete(operation.id);
          LoggerService.instance.i(
            'Synced: ${operation.type} ${operation.entity}/${operation.entityId}',
          );
        } catch (e) {
          // Increment retry count
          operation.retryCount++;
          await _syncBox.put(operation.id, operation.toJson());
          LoggerService.instance.w(
            'Sync failed for ${operation.id}, retry ${operation.retryCount}: $e',
          );
        }
      }
    } catch (e) {
      LoggerService.instance.e('Sync error: $e');
    } finally {
      _isSyncing = false;
    }
  }

  /// Execute a single sync operation based on type and entity.
  Future<void> _executeSyncOperation(PendingSyncOperation operation) async {
    // Delegate to appropriate service based on entity type
    // This will be implemented by the specific service classes
    switch (operation.entity) {
      case 'product':
      case 'inventory':
      case 'order':
      case 'promotion':
        // Each service should have a sync method called here
        LoggerService.instance.i(
          'Executing sync for ${operation.entity}/${operation.type}',
        );
        break;
      default:
        LoggerService.instance.w('Unknown sync entity: ${operation.entity}');
    }
  }

  /// Clear all pending sync operations.
  Future<void> clearPendingOperations() async {
    if (!_isInitialized) await init();
    await _syncBox.clear();
    LoggerService.instance.i('Cleared all pending sync operations');
  }

  /// Get sync status summary.
  Future<Map<String, dynamic>> getSyncStatus() async {
    final pending = await getPendingOperations();
    final counts = <String, int>{};
    for (final op in pending) {
      counts[op.entity] = (counts[op.entity] ?? 0) + 1;
    }
    return {
      'total_pending': pending.length,
      'by_entity': counts,
      'is_syncing': _isSyncing,
      'is_initialized': _isInitialized,
    };
  }

  /// Dispose the service.
  void dispose() {
    _connectivitySubscription?.cancel();
  }
}

final offlineSyncServiceProvider = Provider<OfflineSyncService>((ref) {
  final service = OfflineSyncService();
  ref.onDispose(() => service.dispose());
  return service;
});
