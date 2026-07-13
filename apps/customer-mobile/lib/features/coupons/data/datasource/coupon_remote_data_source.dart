// lib/features/coupons/data/datasource/coupon_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

class CouponRemoteDataSourceImpl {
  final Dio _dio;

  CouponRemoteDataSourceImpl(this._dio);

  Future<List<dynamic>> getCoupons() async {
    final response = await _dio.get('/coupons');
    return response.data['coupons'] as List<dynamic>;
  }

  Future<bool> validateCoupon(String couponCode) async {
    final response = await _dio.get('/coupons/validate/$couponCode');
    return response.data['valid'] as bool;
  }
}

/// Provider for coupon remote data source
final couponRemoteDataSourceProvider = Provider<CouponRemoteDataSourceImpl>((
  ref,
) {
  final dio = ref.read(dioProvider);
  return CouponRemoteDataSourceImpl(dio);
});
