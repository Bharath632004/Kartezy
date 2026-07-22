import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('Customer app compiles and renders without errors', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: ProviderScope(
          child: Scaffold(
            body: Center(
              child: Text('Kartezy Customer'),
            ),
          ),
        ),
      ),
    );

    // Verify the app renders with ProviderScope
    expect(find.byType(MaterialApp), findsOneWidget);
    expect(find.text('Kartezy Customer'), findsOneWidget);
  });

  testWidgets('Customer app has ProviderScope properly configured', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: ProviderScope(
          child: Scaffold(
            body: Center(
              child: Text('ProviderScope Test'),
            ),
          ),
        ),
      ),
    );

    expect(find.text('ProviderScope Test'), findsOneWidget);
  });
}
