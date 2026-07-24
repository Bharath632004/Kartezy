import 'package:flutter_test/flutter_test.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/shared/models/order_item.dart';
import 'package:customer_mobile/shared/models/address.dart';
import 'package:customer_mobile/shared/models/product.dart';

void main() {
  group('Order', () {
    test('should create Order with all required fields', () {
      final now = DateTime(2024, 1, 15, 10, 0);
      final order = Order(
        id: 'order-1',
        userId: 'user-1',
        cartId: 'cart-1',
        items: [
          const OrderItem(
            id: 'oi-1',
            productId: 'p1',
            productName: 'Test Item',
            price: 100.0,
            quantity: 2,
            selectedVariants: {},
            total: 200.0,
            product: Product(
              id: 'p1',
              name: 'Test Item',
              description: '',
              price: 100.0,
              imageUrl: '',
            ),
          ),
        ],
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
        deliveryAddress: Address(
          id: 'addr-1',
          userId: 'user-1',
          name: 'John Doe',
          phone: '+919876543210',
          addressLine1: '123 Main St',
          addressLine2: '',
          city: 'Mumbai',
          state: 'MH',
          postalCode: '400001',
          country: 'India',
          isDefault: true,
          latitude: 19.0,
          longitude: 72.0,
          createdAt: now,
          updatedAt: now,
        ),
        billingAddress: null,
        orderStatus: 'confirmed',
        paymentStatus: 'pending',
        paymentMethod: 'COD',
        deliveryInstructions: null,
        contactlessDelivery: false,
        deliverySlotStart: null,
        deliverySlotEnd: null,
        estimatedDeliveryTime: DateTime(2024, 1, 15, 14, 0),
        couponCode: null,
        createdAt: now,
        updatedAt: now,
      );

      expect(order.id, 'order-1');
      expect(order.orderStatus, 'confirmed');
      expect(order.paymentMethod, 'COD');
      expect(order.items.length, 1);
      expect(order.itemCount, 1);
      expect(order.deliveryAddress.city, 'Mumbai');
    });
  });
}
