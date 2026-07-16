// lib/features/order_management/domain/usecase/pickup_order_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class PickupOrderUseCase {
  final OrderRepository _repository;

  PickupOrderUseCase(this._repository);

  Future<Order> call(String orderId, String otp) =>
      _repository.pickupOrder(orderId, otp);
}
