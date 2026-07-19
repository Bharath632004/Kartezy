import 'package:customer_mobile/shared/models/order.dart';

abstract class OrderRepository {
  Future<Order> getOrder(String orderId);
  Future<List<Order>> getUserOrders(String? userId);
  Future<Order> placeOrder(Map<String, dynamic> orderData);
  Future<Order> cancelOrder(String orderId);
}
