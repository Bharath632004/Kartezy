// lib/features/coupons/data/datasource/coupon_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CouponRemoteDataSource {
  final Dio _dio;

  CouponRemoteDataSource(this._dio);

  Future<List<dynamic>> getCoupons() async {
    final response = await _dio.get('/coupons');
    return response.data['coupons'] as List<dynamic>;
  }
}

/// Provider for coupon remote data source
final couponRemoteDataSourceProvider = Provider<CouponRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return CouponRemoteDataSource(dio);
});