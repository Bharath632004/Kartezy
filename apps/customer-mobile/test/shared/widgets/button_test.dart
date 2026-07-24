import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/widgets/button.dart';
import 'package:customer_mobile/core/theme/theme.dart';
import 'package:customer_mobile/core/theme/theme_provider.dart';

Widget createTestApp({required Widget child}) {
  return ProviderScope(
    overrides: [
      themeProvider.overrideWithValue(AppTheme.lightTheme),
    ],
    child: MaterialApp(
      home: Scaffold(
        body: Center(child: child),
      ),
    ),
  );
}

void main() {
  testWidgets('AppButton renders with text', (WidgetTester tester) async {
    await tester.pumpWidget(
      createTestApp(
        child: AppButton(text: 'Login', onPressed: () {}),
      ),
    );

    expect(find.text('Login'), findsOneWidget);
  });

  testWidgets('AppButton triggers onPressed when tapped', (
    WidgetTester tester,
  ) async {
    bool pressed = false;
    await tester.pumpWidget(
      createTestApp(
        child: AppButton(
          text: 'Tap Me',
          onPressed: () => pressed = true,
        ),
      ),
    );

    await tester.tap(find.text('Tap Me'));
    expect(pressed, isTrue);
  });

  testWidgets('AppButton shows loading indicator', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      createTestApp(
        child: AppButton(
          text: 'Loading',
          onPressed: () {},
          isLoading: true,
        ),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
