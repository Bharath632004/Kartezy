import 'package:flutter_test/flutter_test.dart';
import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';
import 'package:customer_mobile/shared/models/product.dart';

void main() {
  group('Cart', () {
    test('should calculate subtotal and total correctly', () {
      final cart = const Cart(
        id: 'cart-1',
        userId: 'user-1',
        items: [
          CartItem(
            id: 'item-1',
            productId: 'p1',
            product: Product(
              id: 'p1',
              name: 'Item 1',
              description: 'Test item 1',
              price: 100.0,
              imageUrl: '',
            ),
            quantity: 2,
            selectedVariants: {},
          ),
        ],
        couponCode: null,
        discountAmount: 0,
        totalAmount: 200.0,
        itemCount: 1,
        platformFee: 5.0,
        deliveryCharges: 20.0,
        packagingFee: 0,
        gstAmount: 10.0,
        tipAmount: 0,
        walletAmount: 0,
        netAmount: 235.0,
      );

      expect(cart.itemCount, 1);
      expect(cart.items.length, 1);
      expect(cart.subtotal, 200.0);
      expect(cart.netAmount, 235.0);
    });

    test('should calculate subtotal from items', () {
      final cart = const Cart(
        id: 'cart-2',
        userId: 'user-1',
        items: [
          CartItem(
            id: 'item-1',
            productId: 'p1',
            product: Product(
              id: 'p1',
              name: 'Item 1',
              description: '',
              price: 100.0,
              imageUrl: '',
            ),
            quantity: 2,
            selectedVariants: {},
          ),
          CartItem(
            id: 'item-2',
            productId: 'p2',
            product: Product(
              id: 'p2',
              name: 'Item 2',
              description: '',
              price: 50.0,
              imageUrl: '',
            ),
            quantity: 3,
            selectedVariants: {},
          ),
        ],
        couponCode: null,
        discountAmount: 0,
        totalAmount: 350.0,
        itemCount: 2,
        platformFee: 5.0,
        deliveryCharges: 20.0,
        packagingFee: 0,
        gstAmount: 10.0,
        tipAmount: 0,
        walletAmount: 0,
        netAmount: 385.0,
      );

      expect(cart.subtotal, 350.0); // (100*2) + (50*3)
    });
  });
}
