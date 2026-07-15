// lib/features/order_management/domain/usecase/reject_order_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RejectOrderUseCase {
  final OrderRepository _repository;

  RejectOrderUseCase(this._repository);

  Future<Order> call(String orderId, String reason) =>
      _repository.rejectOrder(orderId, reason);
}

/// Provider for reject order use case
final rejectOrderUseCaseProvider = Provider<RejectOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return RejectOrderUseCase(repository);
});
