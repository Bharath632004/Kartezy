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
    return await _remoteDataSource.getAvailableOrders();
  }

  @override
  Future<Order> acceptOrder(String orderId) async {
    return await _remoteDataSource.acceptOrder(orderId);
  }

  @override
  Future<Order> rejectOrder(String orderId, String reason) async {
    return await _remoteDataSource.rejectOrder(orderId, reason);
  }

  @override
  Future<Order> pickupOrder(String orderId, String otp) async {
    return await _remoteDataSource.pickupOrder(orderId, otp);
  }

  @override
  Future<Order> verifyOtp(String orderId, String otp) async {
    return await _remoteDataSource.verifyOtp(orderId, otp);
  }

  @override
  Future<Order> deliverOrder(String orderId) async {
    return await _remoteDataSource.deliverOrder(orderId);
  }

  @override
  Future<Order> submitProofOfDelivery(
    String orderId,
    String? signature,
    List<String>? photos,
    String? notes,
  ) async {
    return await _remoteDataSource.submitProofOfDelivery(
      orderId,
      signature,
      photos,
      notes,
    );
  }

  @override
  Future<List<Order>> getOrderHistory({
    int? page,
    int? limit,
    String? status,
  }) async {
    return await _remoteDataSource.getOrderHistory(
      page: page,
      limit: limit,
      status: status,
    );
  }

  @override
  Future<List<OrderTimeline>> getOrderTimeline(String orderId) async {
    return await _remoteDataSource.getOrderTimeline(orderId);
  }
}

