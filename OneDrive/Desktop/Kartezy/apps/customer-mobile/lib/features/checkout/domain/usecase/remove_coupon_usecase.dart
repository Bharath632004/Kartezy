// lib/features/checkout/domain/usecase/remove_coupon_usecase.dart
import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';

class RemoveCouponUseCase {
  final CheckoutRepository repository;

  RemoveCouponUseCase(this.repository);

  Future<CheckoutSummary> call() => repository.removeCoupon();
}
