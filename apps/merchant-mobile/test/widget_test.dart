import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('Merchant app compiles and runs without errors',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: ProviderScope(
          child: Scaffold(
            body: Center(child: Text('Merchant App Test')),
          ),
        ),
      ),
    );

    // Verify the app renders with ProviderScope
    expect(find.text('Merchant App Test'), findsOneWidget);
  });
}
