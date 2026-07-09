import 'package:customer_mobile/features/refund/domain/repository/refund_repository.dart';

class RequestRefundUseCase {
  final RefundRepository repository;

  RequestRefundUseCase(this.repository);

  Future<Map<String, dynamic>> call(String orderId, String reason) async {
    return await repository.requestRefund(orderId, reason);
  }
}