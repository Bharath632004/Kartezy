// lib/features/order_management/domain/usecase/submit_proof_of_delivery_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class SubmitProofOfDeliveryUseCase {
  final OrderRepository _repository;

  SubmitProofOfDeliveryUseCase(this._repository);

  Future<Order> call(
    String orderId,
    String? signature,
    List<String>? photos,
    String? notes,
  ) => _repository.submitProofOfDelivery(orderId, signature, photos, notes);
}
