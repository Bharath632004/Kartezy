import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class GetPaymentUseCase {
  final PaymentRepository repository;

  GetPaymentUseCase(this.repository);

  Future<Payment> call(String paymentId) => repository.getPayment(paymentId);
}
