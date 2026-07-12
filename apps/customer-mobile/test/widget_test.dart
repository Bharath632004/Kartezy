// test/widget_test.dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';
import 'package:customer_mobile/main.dart';

class MockHiveManager extends HiveManager {
  MockHiveManager() : super.test();

  @override
  Future<void> init() async {
    // Do not call Hive.initFlutter() as we already initialized Hive in setUpAll
    // Open boxes, ignoring if already open.
    try {
      await Hive.openBox<int>('settings');
    } on HiveError catch (_) {
      // Box already open
    }
    try {
      await Hive.openBox<String>('authToken');
    } on HiveError catch (_) {
      // Box already open
    }
    try {
      await Hive.openBox<List<dynamic>>('cart');
    } on HiveError catch (_) {
      // Box already open
    }
    try {
      await Hive.openBox<List<dynamic>>('recentSearches');
    } on HiveError catch (_) {
      // Box already open
    }
    try {
      await Hive.openBox<List<dynamic>>('addresses');
    } on HiveError catch (_) {
      // Box already open
    }
    try {
      await Hive.openBox<Map<String, dynamic>>('notificationPreferences');
    } on HiveError catch (_) {
      // Box already open
    }
  }
}

void main() {
  // Set up Hive for testing
  setUpAll(() async {
    // Disable Crashlytics logging to avoid errors in tests
    FlutterError.onError = (FlutterErrorDetails details) {
      // Do nothing
    };
    // Initialize Hive with the system temporary directory
    final dir = Directory.systemTemp;
    Hive.init(dir.path);
  });

  // Clean up after tests
  tearDownAll(() async {
    await Hive.deleteFromDisk();
  });

  testWidgets('App loads successfully', (WidgetTester tester) async {
    final mockHiveManager = MockHiveManager();
    // Initialize the mock (will open boxes)
    await mockHiveManager.init();

    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          hiveManagerProvider.overrideWithValue(mockHiveManager),
        ],
        child: const MyApp(),
      ),
    );

    // Wait for any async operations to complete.
    await tester.pumpAndSettle();

    // Verify that the app title is displayed.
    expect(find.text('Kartezy Customer'), findsOneWidget);
  });
}