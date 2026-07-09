// lib/features/checkout/domain/repository/checkout_repository.dart
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/shared/models/order.dart';

abstract class CheckoutRepository {
  Future<CheckoutSummary> getCheckoutSummary(String? userId);
  Future<Order> placeOrder(Map<String, dynamic> orderData);
  Future<void> saveAddress(String addressId, bool isDefault);
  Future<void> setDeliveryInstructions(String instructions);
  Future<void> setContactlessDelivery(bool value);
  Future<void> setInstantDelivery(bool value);
  Future<void> setScheduledDelivery(DateTime dateTime);
  Future<void> selectDeliverySlot(String slot);
  Future<CheckoutSummary> applyCoupon(String couponCode);
  Future<CheckoutSummary> removeCoupon();
}