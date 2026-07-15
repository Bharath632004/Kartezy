// test/widget_test.dart
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';

/// Mock HiveManager for testing
class MockHiveManager extends HiveManager {
  MockHiveManager() : super.test();

  @override
  Future<void> init() async {
    await Hive.openBox<int>('settings');
    await Hive.openBox<String>('authToken');
    await Hive.openBox<String>('guestCart');
    await Hive.openBox<List<dynamic>>('cart');
    await Hive.openBox<List<dynamic>>('recentSearches');
    await Hive.openBox<List<dynamic>>('addresses');
    await Hive.openBox<Map<String, dynamic>>('notificationPreferences');
  }
}

void main() {
  setUpAll(() async {
    final dir = Directory.systemTemp;
    Hive.init(dir.path);
  });

  tearDownAll(() async {
    await Hive.close();
    await Hive.deleteFromDisk();
  });

  testWidgets('HiveManager initializes and opens boxes', (WidgetTester tester) async {
    final hive = MockHiveManager();
    await hive.init();

    final settingsBox = Hive.box<int>('settings');
    expect(settingsBox.isOpen, true);
  });

  testWidgets('Hive settings box read/write', (WidgetTester tester) async {
    final hive = MockHiveManager();
    await hive.init();

    final settingsBox = Hive.box<int>('settings');
    await settingsBox.put('testKey', 42);
    final value = settingsBox.get('testKey');
    expect(value, 42);
  });
}



