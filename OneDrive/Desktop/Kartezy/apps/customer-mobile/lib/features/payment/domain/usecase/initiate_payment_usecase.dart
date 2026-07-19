import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class InitiatePaymentUseCase {
  final PaymentRepository repository;

  InitiatePaymentUseCase(this.repository);

  Future<Payment> call(Map<String, dynamic> paymentData) =>
      repository.initiatePayment(paymentData);
}
