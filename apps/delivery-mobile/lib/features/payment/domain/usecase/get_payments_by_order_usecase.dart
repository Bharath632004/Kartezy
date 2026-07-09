import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class GetPaymentsByOrderUseCase {
  final PaymentRepository repository;

  GetPaymentsByOrderUseCase(this.repository);

  Future<List<Payment>> call(String orderId) =>
      repository.getPaymentsByOrder(orderId);
}