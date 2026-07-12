// lib/features/order_management/domain/usecase/get_order_history_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetOrderHistoryUseCase {
  final OrderRepository _repository;

  GetOrderHistoryUseCase(this._repository);

  Future<List<Order>> call({int? page, int? limit, String? status}) => _repository.getOrderHistory(
        page: page,
        limit: limit,
        status: status,
      );
}

/// Provider for get order history use case
final getOrderHistoryUseCaseProvider = Provider<GetOrderHistoryUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return GetOrderHistoryUseCase(repository);
});
