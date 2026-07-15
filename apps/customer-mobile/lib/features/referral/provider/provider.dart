// lib/features/referral/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'data/datasource/referral_remote_data_source_impl.dart';
import 'data/repository/referral_repository_impl.dart';
import 'domain/repository/referral_repository.dart';
import 'domain/usecase/share_referral_code.dart';

// Provider for referral remote data source
final referralRemoteDataSourceProvider = Provider<ReferralRemoteDataSource>((ref) {
  final dioClient = DioClient(ref: ref);
  return ReferralRemoteDataSourceImpl(dioClient);
});

// Provider for referral repository
final referralRepositoryProvider = Provider<ReferralRepository>((ref) {
  final remoteDataSource = ref.read(referralRemoteDataSourceProvider);
  return ReferralRepositoryImpl(remoteDataSource);
});

// Provider for share referral code use case
final shareReferralCodeProvider = Provider<ShareReferralCode>((ref) {
  return ShareReferralCode(ref.read(referralRepositoryProvider));
});