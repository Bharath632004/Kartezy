// lib/features/order_management/domain/usecase/get_available_orders_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetAvailableOrdersUseCase {
  final OrderRepository _repository;

  GetAvailableOrdersUseCase(this._repository);

  Future<List<Order>> call() => _repository.getAvailableOrders();
}

/// Provider for get available orders use case
final getAvailableOrdersUseCaseProvider = Provider<GetAvailableOrdersUseCase>((
  ref,
) {
  final repository = ref.read(orderRepositoryProvider);
  return GetAvailableOrdersUseCase(repository);
});
