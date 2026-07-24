// lib/features/order/data/datasource/order_remote_data_source.dart
// Backend: OrderServiceController exposed at base URL (configured via api-gateway)
// POST   /orders              -> createOrder
// GET    /orders/{id}         -> getOrderDetail
// GET    /orders/user/{userId} -> getUserOrders
// PUT    /orders/{orderId}/cancel -> cancelOrder

import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/shared/utils/order_json_mapper.dart';

abstract class OrderRemoteDataSource {
  Future<Order> getOrder(String orderId);
  Future<List<Order>> getUserOrders(String? userId);
  Future<Order> createOrder(Map<String, dynamic> orderData);
  Future<Order> cancelOrder(String orderId);
}

class OrderRemoteDataSourceImpl implements OrderRemoteDataSource {
  final Dio _dio;

  OrderRemoteDataSourceImpl(this._dio);

  @override
  Future<Order> getOrder(String orderId) async {
    final response = await _dio.get('/orders/$orderId');
    return Order.fromJson(normalizeOrderJson(response.data));
  }

  @override
  Future<List<Order>> getUserOrders(String? userId) async {
    // Backend expects: GET /orders/user/{userId}
    final response = await _dio.get('/orders/user/$userId');
    final List<dynamic> data = response.data is List
        ? response.data
        : (response.data['data'] ?? response.data['content'] ?? []);
    return data
        .map((json) => Order.fromJson(normalizeOrderJson(json)))
        .toList();
  }

  @override
  Future<Order> createOrder(Map<String, dynamic> orderData) async {
    // Backend: POST /orders accepts CreateOrderRequestDto
    final response = await _dio.post('/orders', data: orderData);
    return Order.fromJson(normalizeOrderJson(response.data));
  }

  @override
  Future<Order> cancelOrder(String orderId) async {
    // Backend: PUT /orders/{orderId}/cancel?reason=...
    final response = await _dio.put('/orders/$orderId/cancel');
    return Order.fromJson(normalizeOrderJson(response.data));
  }
}
