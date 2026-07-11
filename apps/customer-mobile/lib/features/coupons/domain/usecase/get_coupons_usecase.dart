// lib/features/coupons/domain/usecase/get_coupons_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/features/coupons/domain/repository/coupon_repository.dart';
import 'package:customer_mobile/shared/models/coupon.dart';

class GetCouponsUseCase {
  final CouponRepository _repository;

  GetCouponsUseCase(this._repository);

  Future<Either<Exception, List<Coupon>>> call() async {
    try {
      final coupons = await _repository.getCoupons();
      return Right(coupons);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}