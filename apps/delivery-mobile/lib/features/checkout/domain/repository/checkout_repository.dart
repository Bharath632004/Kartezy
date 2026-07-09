import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/order.dart';

abstract class CheckoutRepository {
  Future<Cart> getCheckoutSummary(String? userId);
  Future<Order> placeOrder(Map<String, dynamic> orderData);
  Future<void> saveAddress(String addressId, bool isDefault);
  Future<void> setDeliveryInstructions(String instructions);
  Future<void> setContactlessDelivery(bool value);
  Future<void> setInstantDelivery(bool value);
  Future<void> setScheduledDelivery(DateTime dateTime);
  Future<void> selectDeliverySlot(String slot);
  Future<Cart> applyCoupon(String couponCode);
  Future<Cart> removeCoupon();
}
