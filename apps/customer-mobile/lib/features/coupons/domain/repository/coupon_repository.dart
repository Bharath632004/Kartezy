// lib/features/coupons/domain/repository/coupon_repository.dart
import 'package:customer_mobile/shared/models/coupon.dart';

abstract class CouponRepository {
  Future<List<Coupon>> getCoupons();
  Future<bool> validateCoupon(String couponCode);
}
