// lib/features/order_management/domain/usecase/accept_order_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AcceptOrderUseCase {
  final OrderRepository _repository;

  AcceptOrderUseCase(this._repository);

  Future<Order> call(String orderId) => _repository.acceptOrder(orderId);
}

/// Provider for accept order use case
final acceptOrderUseCaseProvider = Provider<AcceptOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return AcceptOrderUseCase(repository);
});
