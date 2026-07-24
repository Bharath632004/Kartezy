import 'package:flutter_test/flutter_test.dart';
import 'package:customer_mobile/shared/models/product.dart';

void main() {
  group('Product', () {
    test('should create Product with all fields', () {
      final product = const Product(
        id: 'prod-1',
        name: 'Fresh Milk',
        description: 'Fresh cow milk 1L',
        price: 56.00,
        imageUrl: 'https://example.com/milk.jpg',
        shortDescription: 'Fresh milk',
        unit: '1 L',
        stock: 50,
        sku: 'MILK-001',
        categoryId: 'cat-dairy',
        merchantId: 'merchant-1',
        merchantName: 'Dairy Farm',
        rating: 4.5,
        reviewCount: 120,
        isFavorite: false,
        hasVariants: false,
        tags: ['dairy', 'milk'],
      );

      expect(product.id, 'prod-1');
      expect(product.name, 'Fresh Milk');
      expect(product.price, 56.00);
      expect(product.stock, 50);
      expect(product.isAvailable, isTrue);
    });

    test('should support copyWith', () {
      final product = const Product(
        id: 'prod-1',
        name: 'Fresh Milk',
        description: 'Fresh cow milk 1L',
        price: 56.00,
        imageUrl: 'https://example.com/milk.jpg',
      );

      final updated = product.copyWith(price: 60.00, isFavorite: true);
      expect(updated.price, 60.00);
      expect(updated.isFavorite, isTrue);
      expect(updated.id, 'prod-1'); // unchanged
    });

    test('should not be available when stock is 0', () {
      final product = const Product(
        id: 'prod-2',
        name: 'Out of Stock Item',
        description: '',
        price: 100.00,
        imageUrl: '',
        stock: 0,
      );

      expect(product.isAvailable, isFalse);
    });
  });
}
