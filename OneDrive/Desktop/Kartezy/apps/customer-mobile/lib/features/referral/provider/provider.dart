// lib/features/referral/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:customer_mobile/features/referral/data/datasource/referral_remote_data_source.dart';
import 'package:customer_mobile/features/referral/data/datasource/referral_remote_data_source_impl.dart';
import 'package:customer_mobile/features/referral/data/repository/referral_repository_impl.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';
import 'package:customer_mobile/features/referral/domain/usecase/get_referral_code.dart';
import 'package:customer_mobile/features/referral/domain/usecase/get_referral_history.dart';
import 'package:customer_mobile/features/referral/domain/usecase/share_referral_code.dart';

// Provider for referral remote data source
final referralRemoteDataSourceProvider = Provider<ReferralRemoteDataSource>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return ReferralRemoteDataSourceImpl(dioClient);
});

// Provider for referral repository
final referralRepositoryProvider = Provider<ReferralRepository>((ref) {
  final remoteDataSource = ref.read(referralRemoteDataSourceProvider);
  return ReferralRepositoryImpl(remoteDataSource);
});

// Provider for get referral code use case
final getReferralCodeProvider = Provider<GetReferralCode>((ref) {
  return GetReferralCode(ref.read(referralRepositoryProvider));
});

// Provider for get referral history use case
final getReferralHistoryProvider = Provider<GetReferralHistory>((ref) {
  return GetReferralHistory(ref.read(referralRepositoryProvider));
});

// Provider for share referral code use case
final shareReferralCodeProvider = Provider<ShareReferralCode>((ref) {
  return ShareReferralCode(ref.read(referralRepositoryProvider));
});
