// lib/features/order_management/domain/usecase/get_order_timeline_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order_timeline.dart';

class GetOrderTimelineUseCase {
  final OrderRepository _repository;

  GetOrderTimelineUseCase(this._repository);

  Future<List<OrderTimeline>> call(String orderId) =>
      _repository.getOrderTimeline(orderId);
}
