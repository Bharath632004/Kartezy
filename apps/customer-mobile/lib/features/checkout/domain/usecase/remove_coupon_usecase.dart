import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class RemoveCouponUseCase {
  final CheckoutRepository repository;

  RemoveCouponUseCase(this.repository);

  Future<Cart> call() => repository.removeCoupon();
}
