// lib/features/order_management/domain/usecase/get_order_timeline_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order_timeline.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetOrderTimelineUseCase {
  final OrderRepository _repository;

  GetOrderTimelineUseCase(this._repository);

  Future<List<OrderTimeline>> call(String orderId) =>
      _repository.getOrderTimeline(orderId);
}

/// Provider for get order timeline use case
final getOrderTimelineUseCaseProvider = Provider<GetOrderTimelineUseCase>((
  ref,
) {
  final repository = ref.read(orderRepositoryProvider);
  return GetOrderTimelineUseCase(repository);
});
