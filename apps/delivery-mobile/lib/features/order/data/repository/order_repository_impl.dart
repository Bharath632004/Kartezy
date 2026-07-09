import 'package:customer_mobile/features/order/data/datasource/order_remote_data_source.dart';
import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class OrderRepositoryImpl implements OrderRepository {
  final OrderRemoteDataSource _remoteDataSource;

  OrderRepositoryImpl(this._remoteDataSource);

  @override
  Future<Order> getOrder(String orderId) =>
      _remoteDataSource.getOrder(orderId);

  @override
  Future<List<Order>> getUserOrders(String? userId) =>
      _remoteDataSource.getUserOrders(userId);

  @override
  Future<Order> placeOrder(Map<String, dynamic> orderData) =>
      _remoteDataSource.createOrder(orderData);

  @override
  Future<Order> cancelOrder(String orderId) =>
      _remoteDataSource.cancelOrder(orderId);
}