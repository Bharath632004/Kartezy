import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class RefundPaymentUseCase {
  final PaymentRepository repository;

  RefundPaymentUseCase(this.repository);

  Future<Payment> call(String paymentId, double? amount) =>
      repository.refundPayment(paymentId, amount);
}
