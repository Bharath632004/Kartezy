// lib/features/order_management/domain/usecase/accept_order_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class AcceptOrderUseCase {
  final OrderRepository _repository;

  AcceptOrderUseCase(this._repository);

  Future<Order> call(String orderId) => _repository.acceptOrder(orderId);
}
