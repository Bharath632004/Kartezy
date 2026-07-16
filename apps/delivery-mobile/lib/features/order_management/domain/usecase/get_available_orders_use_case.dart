// lib/features/order_management/domain/usecase/get_available_orders_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class GetAvailableOrdersUseCase {
  final OrderRepository _repository;

  GetAvailableOrdersUseCase(this._repository);

  Future<List<Order>> call() => _repository.getAvailableOrders();
}
