// lib/features/coupons/domain/usecase/validate_coupon_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/features/coupons/domain/repository/coupon_repository.dart';

class ValidateCouponUseCase {
  final CouponRepository _repository;

  ValidateCouponUseCase(this._repository);

  Future<Either<Exception, bool>> call(String couponCode) async {
    try {
      final isValid = await _repository.validateCoupon(couponCode);
      return Right(isValid);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}
