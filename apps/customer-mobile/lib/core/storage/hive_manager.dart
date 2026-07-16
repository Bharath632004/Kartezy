// lib/core/storage/hive_manager.dart
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Hive manager for local storage operations.
class HiveManager {
  HiveManager._internal();

  /// For testing purposes.
  HiveManager.test() : this._internal();

  static final HiveManager _instance = HiveManager._internal();
  static HiveManager? _instanceOverride;

  factory HiveManager() {
    if (_instanceOverride != null) {
      return _instanceOverride!;
    }
    return _instance;
  }

  /// Set an instance for testing purposes.
  static void setInstanceForTesting(HiveManager instance) {
    _instanceOverride = instance;
  }

  /// Clear the instance override.
  static void clearInstanceOverride() {
    _instanceOverride = null;
  }

  /// Initialize Hive with adapters and open boxes.
  Future<void> init() async {
    await Hive.initFlutter();

    // Register Hive type adapters here if you have custom model types

    // Open boxes
    await _openBoxes();
  }

  Future<void> _openBoxes() async {
    // Open boxes for different purposes
    await Hive.openBox<int>('settings');
    await Hive.openBox<String>('authToken');
    await Hive.openBox<List<dynamic>>('cart');
    await Hive.openBox<List<dynamic>>('recentSearches');
    await Hive.openBox<List<dynamic>>('addresses');
    await Hive.openBox<Map<String, dynamic>>('notificationPreferences');
    // Add more boxes as needed
  }

  /// Get a box by name.
  Box<T> getBox<T>({required String boxName}) {
    return Hive.box<T>(boxName);
  }

  /// Close all boxes.
  Future<void> close() async {
    await Hive.close();
  }

  /// Clear all boxes (for testing or logout).
  Future<void> clear() async {
    await Hive.deleteFromDisk();
  }
}

/// Provider for Hive manager
final hiveManagerProvider = Provider<HiveManager>((ref) {
  return HiveManager();
});
