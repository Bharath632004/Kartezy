import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:dio/dio.dart';

abstract class CheckoutRemoteDataSource {
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

class CheckoutRemoteDataSourceImpl implements CheckoutRemoteDataSource {
  final DioClient _dioClient;

  CheckoutRemoteDataSourceImpl(this._dioClient);

  @override
  Future<Cart> getCheckoutSummary(String? userId) async {
    final response = await _dioClient.get(
      userId == null ? '/checkout/guest-summary' : '/checkout/user-summary',
      queryParameters: {'userId': userId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Order> placeOrder(Map<String, dynamic> orderData) async {
    final response = await _dioClient.post('/checkout/place-order', data: orderData);
    return Order.fromJson(response.data);
  }

  @override
  Future<void> saveAddress(String addressId, bool isDefault) async {
    await _dioClient.post('/address/save', data: {
      'addressId': addressId,
      'isDefault': isDefault,
    });
  }

  @override
  Future<void> setDeliveryInstructions(String instructions) async {
    await _dioClient.post('/checkout/set-delivery-instructions', data: {
      'instructions': instructions,
    });
  }

  @override
  Future<void> setContactlessDelivery(bool value) async {
    await _dioClient.post('/checkout/set-contactless-delivery', data: {
      'value': value,
    });
  }

  @override
  Future<void> setInstantDelivery(bool value) async {
    await _dioClient.post('/checkout/set-instant-delivery', data: {
      'value': value,
    });
  }

  @override
  Future<void> setScheduledDelivery(DateTime dateTime) async {
    await _dioClient.post('/checkout/set-scheduled-delivery', data: {
      'dateTime': dateTime.toIso8601String(),
    });
  }

  @override
  Future<void> selectDeliverySlot(String slot) async {
    await _dioClient.post('/checkout/select-delivery-slot', data: {
      'slot': slot,
    });
  }

  @override
  Future<Cart> applyCoupon(String couponCode) async {
    final response = await _dioClient.post('/checkout/apply-coupon', data: {
      'couponCode': couponCode,
    });
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> removeCoupon() async {
    final response = await _dioClient.post('/checkout/remove-coupon');
    return Cart.fromJson(response.data);
  }
}
