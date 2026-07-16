// lib/features/order_management/domain/usecase/deliver_order_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class DeliverOrderUseCase {
  final OrderRepository _repository;

  DeliverOrderUseCase(this._repository);

  Future<Order> call(String orderId) => _repository.deliverOrder(orderId);
}
