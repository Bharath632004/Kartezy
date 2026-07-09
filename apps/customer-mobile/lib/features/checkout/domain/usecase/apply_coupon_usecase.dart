import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class ApplyCouponUseCase {
  final CheckoutRepository repository;

  ApplyCouponUseCase(this.repository);

  Future<Cart> call(String couponCode) =>
      repository.applyCoupon(couponCode);
}
