import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class CancelOrderUseCase {
  final OrderRepository repository;

  CancelOrderUseCase(this.repository);

  Future<Order> call(String orderId) =>
      repository.cancelOrder(orderId);
}