import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:dio/dio.dart';

abstract class OrderRemoteDataSource {
  Future<Order> getOrder(String orderId);
  Future<List<Order>> getUserOrders(String? userId);
  Future<Order> createOrder(Map<String, dynamic> orderData);
  Future<Order> cancelOrder(String orderId);
}

class OrderRemoteDataSourceImpl implements OrderRemoteDataSource {
  final DioClient _dioClient;

  OrderRemoteDataSourceImpl(this._dioClient);

  @override
  Future<Order> getOrder(String orderId) async {
    final response = await _dioClient.get('/orders/$orderId');
    return Order.fromJson(response.data);
  }

  @override
  Future<List<Order>> getUserOrders(String? userId) async {
    final response = await _dioClient.get(
      '/orders',
      queryParameters: {
        if (userId != null) 'userId': userId,
      },
    );
    final List<dynamic> data = response.data;
    return data.map((json) => Order.fromJson(json)).toList();
  }

  @override
  Future<Order> createOrder(Map<String, dynamic> orderData) async {
    final response = await _dioClient.post('/orders', data: orderData);
    return Order.fromJson(response.data);
  }

  @override
  Future<Order> cancelOrder(String orderId) async {
    final response = await _dioClient.delete('/orders/$orderId');
    return Order.fromJson(response.data);
  }
}