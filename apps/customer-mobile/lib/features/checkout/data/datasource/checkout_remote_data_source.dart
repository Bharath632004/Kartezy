// lib/features/checkout/data/datasource/checkout_remote_data_source.dart
// For MVP, checkout operations that require backend calls are routed to
// the order service (POST /orders). Cart summary is derived locally.
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/shared/utils/order_json_mapper.dart';
import 'package:customer_mobile/features/cart/data/datasource/cart_remote_data_source.dart';
import 'package:customer_mobile/features/cart/data/datasource/cart_local_data_source.dart';

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
  final CartRemoteDataSource _cartLocalSource;

  CheckoutRemoteDataSourceImpl(
    this._dio, {
    CartRemoteDataSource? cartLocalSource,
  }) : _cartLocalSource = cartLocalSource ?? CartLocalDataSource();

  @override
  Future<CheckoutSummary> getCheckoutSummary(String? userId) async {
    // Derive checkout summary from local cart (no backend checkout endpoint)
    final cart = await _cartLocalSource.getCart(userId);
    return CheckoutSummary(
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount,
      itemCount: cart.itemCount,
      platformFee: cart.platformFee,
      deliveryCharges: cart.deliveryCharges,
      packagingFee: cart.packagingFee,
      gstAmount: cart.gstAmount,
      tipAmount: cart.tipAmount,
      walletAmount: cart.walletAmount,
      netAmount: cart.netAmount,
    );
  }

  @override
  Future<Order> placeOrder(Map<String, dynamic> orderData) async {
    // Backend: POST /orders accepts CreateOrderRequestDto
    final response = await _dio.post('/orders', data: orderData);
    return Order.fromJson(normalizeOrderJson(response.data));
  }

  @override
  Future<void> saveAddress(String addressId, bool isDefault) async {
    // Stored locally via address feature provider; no backend call for MVP
  }

  @override
  Future<void> setDeliveryInstructions(String instructions) async {
    // Handled locally in checkout state
  }

  @override
  Future<void> setContactlessDelivery(bool value) async {
    // Handled locally in checkout state
  }

  @override
  Future<void> setInstantDelivery(bool value) async {
    // Handled locally in checkout state
  }

  @override
  Future<void> setScheduledDelivery(DateTime dateTime) async {
    // Handled locally in checkout state
  }

  @override
  Future<void> selectDeliverySlot(String slot) async {
    // Handled locally in checkout state
  }

  @override
  Future<CheckoutSummary> applyCoupon(String couponCode) async {
    // Applied locally via cart data source
    final cart = await _cartLocalSource.applyCoupon(couponCode);
    return CheckoutSummary(
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount,
      itemCount: cart.itemCount,
      platformFee: cart.platformFee,
      deliveryCharges: cart.deliveryCharges,
      packagingFee: cart.packagingFee,
      gstAmount: cart.gstAmount,
      tipAmount: cart.tipAmount,
      walletAmount: cart.walletAmount,
      netAmount: cart.netAmount,
    );
  }

  @override
  Future<CheckoutSummary> removeCoupon() async {
    final cart = await _cartLocalSource.removeCoupon();
    return CheckoutSummary(
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount,
      itemCount: cart.itemCount,
      platformFee: cart.platformFee,
      deliveryCharges: cart.deliveryCharges,
      packagingFee: cart.packagingFee,
      gstAmount: cart.gstAmount,
      tipAmount: cart.tipAmount,
      walletAmount: cart.walletAmount,
      netAmount: cart.netAmount,
    );
  }
}
