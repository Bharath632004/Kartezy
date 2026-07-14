// lib/features/order_management/data/repository/order_repository_impl.dart
import 'package:delivery_mobile/features/order_management/data/datasource/order_remote_data_source.dart';
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:delivery_mobile/shared/models/order_timeline.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource _remoteDataSource;

  OrderRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Order>> getAvailableOrders() async {
    final response = await _remoteDataSource.getAvailableOrders();
    return response.map((e) => Order.fromJson(e)).toList();
  }

  @override
  Future<Order> acceptOrder(String orderId) async {
    final response = await _remoteDataSource.acceptOrder(orderId);
    return Order.fromJson(response);
  }

  @override
  Future<Order> rejectOrder(String orderId, String reason) async {
    final response = await _remoteDataSource.rejectOrder(orderId, reason);
    return Order.fromJson(response);
  }

  @override
  Future<Order> pickupOrder(String orderId, String otp) async {
    final response = await _remoteDataSource.pickupOrder(orderId, otp);
    return Order.fromJson(response);
  }

  @override
  Future<Order> verifyOtp(String orderId, String otp) async {
    final response = await _remoteDataSource.verifyOtp(orderId, otp);
    return Order.fromJson(response);
  }

  @override
  Future<Order> deliverOrder(String orderId) async {
    final response = await _remoteDataSource.deliverOrder(orderId);
    return Order.fromJson(response);
  }

  @override
  Future<Order> submitProofOfDelivery(
    String orderId,
    String? signature,
    List<String>? photos,
    String? notes,
  ) async {
    final response = await _remoteDataSource.submitProofOfDelivery(
      orderId,
      signature,
      photos,
      notes,
    );
    return Order.fromJson(response);
  }

  @override
  Future<List<Order>> getOrderHistory({
    int? page,
    int? limit,
    String? status,
  }) async {
    final response = await _remoteDataSource.getOrderHistory(
      page: page,
      limit: limit,
      status: status,
    );
    return response.map((e) => Order.fromJson(e)).toList();
  }

  @override
  Future<List<OrderTimeline>> getOrderTimeline(String orderId) async {
    final response = await _remoteDataSource.getOrderTimeline(orderId);
    return response.map((e) => OrderTimeline.fromJson(e)).toList();
  }
}

/// Provider for order repository
final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  final remoteDataSource = ref.read(orderRemoteDataSourceProvider);
  return OrderRepositoryImpl(remoteDataSource);
});
