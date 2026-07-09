import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/coupons/data/datasource/coupon_remote_data_source.dart';
import 'package:customer_mobile/features/coupons/data/repository/coupon_repository_impl.dart';
import 'package:customer_mobile/features/coupons/domain/repository/coupon_repository.dart';
import 'package:customer_mobile/features/coupons/domain/usecase/get_coupons_usecase.dart';
import 'package:customer_mobile/features/coupons/domain/usecase/validate_coupon_usecase.dart';
import 'package:customer_mobile/core/network/dio_client.dart';

// Providers for data source and repository
final couponRemoteDataSourceProvider = Provider<CouponRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return CouponRemoteDataSourceImpl(dioClient);
});

final couponRepositoryProvider = Provider<CouponRepository>((ref) {
  final remoteDataSource = ref.read(couponRemoteDataSourceProvider);
  return CouponRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getCouponsUseCaseProvider = Provider<GetCouponsUseCase>((ref) {
  final repository = ref.read(couponRepositoryProvider);
  return GetCouponsUseCase(repository);
});

final validateCouponUseCaseProvider = Provider<ValidateCouponUseCase>((ref) {
  final repository = ref.read(couponRepositoryProvider);
  return ValidateCouponUseCase(repository);
});