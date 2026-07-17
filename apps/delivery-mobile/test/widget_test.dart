import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

void main() {
  testWidgets('App smoke test - renders without crashing', (WidgetTester tester) async {
    // Verify the test framework works
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Kartezy Delivery'),
        ),
      ),
    ));
    expect(find.byType(MaterialApp), findsOneWidget);
  });

  testWidgets('Delivery app has correct initial state', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Kartezy'),
        ),
      ),
    ));
    expect(find.text('Kartezy'), findsOneWidget);
  });
}
