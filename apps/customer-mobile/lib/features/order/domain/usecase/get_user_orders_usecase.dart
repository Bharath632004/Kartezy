import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/shared/models/order.dart';

class GetUserOrdersUseCase {
  final OrderRepository repository;

  GetUserOrdersUseCase(this.repository);

  Future<List<Order>> call(String? userId) =>
      repository.getUserOrders(userId);
}