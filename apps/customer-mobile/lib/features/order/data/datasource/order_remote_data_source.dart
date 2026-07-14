// lib/features/order/data/datasource/order_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/order.dart';

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
    return Order.fromJson(response.data);
  }

  @override
  Future<List<Order>> getUserOrders(String? userId) async {
    final response = await _dio.get(
      '/orders',
      queryParameters: {'userId': ?userId},
    );
    final List<dynamic> data = response.data;
    return data.map((json) => Order.fromJson(json)).toList();
  }

  @override
  Future<Order> createOrder(Map<String, dynamic> orderData) async {
    final response = await _dio.post('/orders', data: orderData);
    return Order.fromJson(response.data);
  }

  @override
  Future<Order> cancelOrder(String orderId) async {
    final response = await _dio.delete('/orders/$orderId');
    return Order.fromJson(response.data);
  }
}
