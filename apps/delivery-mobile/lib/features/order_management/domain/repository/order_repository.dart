// lib/features/order_management/domain/repository/order_repository.dart
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:delivery_mobile/shared/models/order_timeline.dart';

abstract class OrderRepository {
  Future<List<Order>> getAvailableOrders();

  Future<Order> acceptOrder(String orderId);

  Future<Order> rejectOrder(String orderId, String reason);

  Future<Order> pickupOrder(String orderId, String otp);

  Future<Order> verifyOtp(String orderId, String otp);

  Future<Order> deliverOrder(String orderId);

  Future<Order> submitProofOfDelivery(
      String orderId,
      String? signature,
      List<String>? photos,
      String? notes);

  Future<List<Order>> getOrderHistory({
    int? page,
    int? limit,
    String? status,
  });

  Future<List<OrderTimeline>> getOrderTimeline(String orderId);
}
