import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class PlaceOrderUseCase {
  final OrderRepository repository;

  PlaceOrderUseCase(this.repository);

  Future<Order> call(Map<String, dynamic> orderData) =>
      repository.placeOrder(orderData);
}