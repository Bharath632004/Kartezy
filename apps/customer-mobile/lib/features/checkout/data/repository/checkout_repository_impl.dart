// lib/features/checkout/data/repository/checkout_repository_impl.dart
import 'package:customer_mobile/features/checkout/data/datasource/checkout_remote_data_source.dart';
import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/shared/models/order.dart';

class CheckoutRepositoryImpl implements CheckoutRepository {
  final CheckoutRemoteDataSource _remoteDataSource;

  CheckoutRepositoryImpl(this._remoteDataSource);

  @override
  Future<CheckoutSummary> getCheckoutSummary(String? userId) =>
      _remoteDataSource.getCheckoutSummary(userId);

  @override
  Future<Order> placeOrder(Map<String, dynamic> orderData) =>
      _remoteDataSource.placeOrder(orderData);

  @override
  Future<void> saveAddress(String addressId, bool isDefault) =>
      _remoteDataSource.saveAddress(addressId, isDefault);

  @override
  Future<void> setDeliveryInstructions(String instructions) =>
      _remoteDataSource.setDeliveryInstructions(instructions);

  @override
  Future<void> setContactlessDelivery(bool value) =>
      _remoteDataSource.setContactlessDelivery(value);

  @override
  Future<void> setInstantDelivery(bool value) =>
      _remoteDataSource.setInstantDelivery(value);

  @override
  Future<void> setScheduledDelivery(DateTime dateTime) =>
      _remoteDataSource.setScheduledDelivery(dateTime);

  @override
  Future<void> selectDeliverySlot(String slot) =>
      _remoteDataSource.selectDeliverySlot(slot);

  @override
  Future<CheckoutSummary> applyCoupon(String couponCode) =>
      _remoteDataSource.applyCoupon(couponCode);

  @override
  Future<CheckoutSummary> removeCoupon() =>
      _remoteDataSource.removeCoupon();
}