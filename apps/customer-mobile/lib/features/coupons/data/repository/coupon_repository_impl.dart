// lib/features/coupons/data/repository/coupon_repository_impl.dart
import 'package:customer_mobile/features/coupons/data/datasource/coupon_remote_data_source.dart';
import 'package:customer_mobile/features/coupons/domain/repository/coupon_repository.dart';
import 'package:customer_mobile/shared/models/coupon.dart';

class CouponRepositoryImpl implements CouponRepository {
  final CouponRemoteDataSourceImpl _remoteDataSource;

  CouponRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Coupon>> getCoupons() async {
    final coupons = await _remoteDataSource.getCoupons();
    return coupons.map((json) => Coupon.fromJson(json)).toList();
  }

  @override
  Future<bool> validateCoupon(String couponCode) async {
    // TODO: Implement validation logic via API
    // For now, return true if the coupon code is not empty
    return couponCode.isNotEmpty;
  }
}
