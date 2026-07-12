import 'package:customer_mobile/features/refund/domain/repository/refund_repository.dart';

class GetRefundStatusUseCase {
  final RefundRepository repository;

  GetRefundStatusUseCase(this.repository);

  Future<Map<String, dynamic>> call(String orderId) async {
    return await repository.getRefundStatus(orderId);
  }
}
