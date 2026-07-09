// lib/features/cart/domain/usecase/remove_coupon_usecase.dart
import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class RemoveCouponUseCase {
  final CartRepository repository;

  RemoveCouponUseCase(this.repository);

  Future<Cart> call() async {
    return await repository.removeCoupon();
  }
}