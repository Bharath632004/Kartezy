// lib/features/checkout/domain/usecase/apply_coupon_usecase.dart
import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';

class ApplyCouponUseCase {
  final CheckoutRepository repository;

  ApplyCouponUseCase(this.repository);

  Future<CheckoutSummary> call(String couponCode) =>
      repository.applyCoupon(couponCode);
}