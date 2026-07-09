import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class GetUserPaymentsUseCase {
  final PaymentRepository repository;

  GetUserPaymentsUseCase(this.repository);

  Future<List<Payment>> call(String? userId) =>
      repository.getUserPayments(userId);
}