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
    // Do nothing, Hive already initialized in setUpAll
  }

  // Optionally override getBox to return a mock box if needed
  @override
  Box<T> getBox<T>({required String boxName}) {
    // For simplicity, we return a mock box that does nothing
    return MockBox<T>();
  }
}

class MockBox<T> implements Box<T> {
  @override
  Future<void> add(T value) async {}

  @override
  Future<void> addAll(Iterable<T> values) async {}

  @override
  T getAt(int index) => throw UnimplementedError();

  @override
  Map<int, T> getAll() => throw UnimplementedError();

  @override
  Iterable<MapEntry<int, T>> get iterator => throw UnimplementedError();

  @override
  Key get key => throw UnimplementedError();

  @override
  int get length => throw UnimplementedError();

  @override
  T get(Object? key) => throw UnimplementedError();

  @override
  bool get isEmpty => throw UnimplementedError();

  @override
  bool get isNotEmpty => throw UnimplementedError();

  @override
  Iterator<MapEntry<int, T>> iterator() => throw UnimplementedError();

  @override
  String get name => throw UnimplementedError();

  @override
  bool containsKey(Object? key) => false;

  @override
  bool containsValue(Object? value) => false;

  @override
  Future<void> clear() async {}

  @override
  Future<void> delete(dynamic key) async {}

  @override
  Future<void> deleteAt(int position) async {}

  @override
  Future<void> deleteFromDisk() => null;

  @override
  void dispose() {}

  @override
  bool get isOpen => false;

  @override
  bool get isBoxDeletedOrDisposed => false;

  @override
  Future:void> put(K key, V value) async {}

  @override
  Future<void> putAll(Map<K, V> map) => null;

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  // Set up Hive for testing
  setUpAll(() async {
    // Initialize Hive with the system temporary directory
    final dir = Directory.systemTemp;
    Hive.init(dir.path);
  });

  // Clean up after tests
  tearDownAll(() async {
    await Hive.deleteFromDisk();
  });

  testWidgets('App loads successfully', (WidgetTester tester) async {
    // Override the HiveManager provider with a mock
    await tester.pumpWidget(
      ProviderScope(
        overrides: [hiveManagerProvider.overrideWithValue(MockHiveManager())],
        child: const MyApp(),
      ),
    );

    // Wait for any async operations to complete.
    await tester.pumpAndSettle();

    // Verify that the app title is displayed.
    expect(find.text('Kartezy Customer'), findsOneWidget);
  });
}