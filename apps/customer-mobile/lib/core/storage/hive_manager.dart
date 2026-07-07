// lib/core/storage/hive_manager.dart
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/config/app_constants.dart';

/// Hive manager for local storage operations.
class HiveManager {
  HiveManager._internal();

  static final HiveManager _instance = HiveManager._internal();

  factory HiveManager() => _instance;

  /// Initialize Hive with adapters and open boxes.
  Future<void> init() async {
    await Hive.initFlutter();

    // Register adapters for your models (if ();

    // Open boxes
    await _openBoxes();
  }

  Future<void> _openBoxes() async {
    // Open boxes for different purposes
    await Hive.openBox<bool>('settings');
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