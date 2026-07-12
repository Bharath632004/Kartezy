// test/widget_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/main.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';

void main() {
  testWidgets('App loads successfully', (WidgetTester tester) async {
    // Override the HiveManager provider with a test instance
    await tester.pumpWidget(
      ProviderScope(
        overrides: [hiveManagerProvider.overrideWithValue(HiveManager.test())],
        child: const MyApp(),
      ),
    );

    // Wait for any async operations to complete.
    await tester.pumpAndSettle();

    // Verify that the app title is displayed.
    expect(find.text('Kartezy Customer'), findsOneWidget);
  });
}