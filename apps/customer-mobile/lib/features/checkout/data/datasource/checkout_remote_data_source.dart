// lib/features/checkout/data/datasource/checkout_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/shared/models/order.dart';

abstract class CheckoutRemoteDataSource {
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

class CheckoutRemoteDataSourceImpl implements CheckoutRemoteDataSource {
  final Dio _dio;

  CheckoutRemoteDataSourceImpl(this._dio);

  @override
  Future<CheckoutSummary> getCheckoutSummary(String? userId) async {
    final response = await _dio.get(
      userId == null ? '/checkout/guest-summary' : '/checkout/user-summary',
      queryParameters: {'userId': userId},
    );
    return CheckoutSummary.fromJson(response.data);
  }

  @override
  Future<Order> placeOrder(Map<String, dynamic> orderData) async {
    final response = await _dio.post('/checkout/place-order', data: orderData);
    return Order.fromJson(response.data);
  }

  @override
  Future<void> saveAddress(String addressId, bool isDefault) async {
    await _dio.post(
      '/address/save',
      data: {'addressId': addressId, 'isDefault': isDefault},
    );
  }

  @override
  Future<void> setDeliveryInstructions(String instructions) async {
    await _dio.post(
      '/checkout/set-delivery-instructions',
      data: {'instructions': instructions},
    );
  }

  @override
  Future<void> setContactlessDelivery(bool value) async {
    await _dio.post(
      '/checkout/set-contactless-delivery',
      data: {'value': value},
    );
  }

  @override
  Future<void> setInstantDelivery(bool value) async {
    await _dio.post('/checkout/set-instant-delivery', data: {'value': value});
  }

  @override
  Future<void> setScheduledDelivery(DateTime dateTime) async {
    await _dio.post(
      '/checkout/set-scheduled-delivery',
      data: {'dateTime': dateTime.toIso8601String()},
    );
  }

  @override
  Future<void> selectDeliverySlot(String slot) async {
    await _dio.post('/checkout/select-delivery-slot', data: {'slot': slot});
  }

  @override
  Future<CheckoutSummary> applyCoupon(String couponCode) async {
    final response = await _dio.post(
      '/checkout/apply-coupon',
      data: {'couponCode': couponCode},
    );
    return CheckoutSummary.fromJson(response.data);
  }

  @override
  Future<CheckoutSummary> removeCoupon() async {
    final response = await _dio.post('/checkout/remove-coupon');
    return CheckoutSummary.fromJson(response.data);
  }
}
