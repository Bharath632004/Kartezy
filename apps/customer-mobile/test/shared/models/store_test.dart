import 'package:flutter_test/flutter_test.dart';
import 'package:customer_mobile/shared/models/store.dart';

void main() {
  group('Store', () {
    test('should create Store with required fields', () {
      final store = const Store(
        id: 'store-1',
        name: 'FreshMart',
        imageUrl: 'https://example.com/store.jpg',
        distance: 2.5,
        isOpen: true,
      );

      expect(store.id, 'store-1');
      expect(store.name, 'FreshMart');
      expect(store.distance, 2.5);
      expect(store.isOpen, isTrue);
    });

    test('should support copyWith', () {
      final store = const Store(
        id: 'store-1',
        name: 'FreshMart',
        imageUrl: 'https://example.com/store.jpg',
        distance: 2.5,
        isOpen: true,
      );

      final updated = store.copyWith(isOpen: false, distance: 3.0);
      expect(updated.isOpen, isFalse);
      expect(updated.distance, 3.0);
      expect(updated.name, 'FreshMart'); // unchanged
    });
  });
}
