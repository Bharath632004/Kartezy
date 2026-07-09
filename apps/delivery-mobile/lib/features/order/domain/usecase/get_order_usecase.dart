import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class GetOrderUseCase {
  final OrderRepository repository;

  GetOrderUseCase(this.repository);

  Future<Order> call(String orderId) => repository.getOrder(orderId);
}