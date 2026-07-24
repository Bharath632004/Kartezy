import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/widgets/product_card.dart';
import 'package:customer_mobile/shared/models/product.dart';
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
  testWidgets('ProductCard displays product name and price', (
    WidgetTester tester,
  ) async {
    const product = Product(
      id: 'prod-1',
      name: 'Fresh Apples',
      description: 'Fresh red apples',
      price: 120.00,
      imageUrl: 'https://example.com/apples.jpg',
    );

    await tester.pumpWidget(
      createTestApp(child: ProductCard(product: product)),
    );

    expect(find.text('Fresh Apples'), findsOneWidget);
    expect(find.text('₹120.00'), findsOneWidget);
  });

  testWidgets('ProductCard has semantic widgets for accessibility', (
    WidgetTester tester,
  ) async {
    const product = Product(
      id: 'prod-2',
      name: 'Organic Bananas',
      description: 'Organic bananas bunch',
      price: 60.00,
      imageUrl: 'https://example.com/bananas.jpg',
    );

    await tester.pumpWidget(
      createTestApp(child: ProductCard(product: product)),
    );

    // Verify the Semantics widget exists
    expect(find.byType(Semantics), findsWidgets);
  });
}
