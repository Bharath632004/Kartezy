// lib/features/checkout/domain/usecase/get_checkout_summary_usecase.dart
import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';

class GetCheckoutSummaryUseCase {
  final CheckoutRepository _repository;

  GetCheckoutSummaryUseCase(this._repository);

  Future<CheckoutSummary> call([String? userId]) => _repository.getCheckoutSummary(userId);
}