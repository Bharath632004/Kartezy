// lib/features/referral/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/datasource/referral_remote_data_source.dart';
import 'data/repository/referral_repository_impl.dart';
import 'domain/repository/referral_repository.dart';

// Provider for referral remote data source
final referralRemoteDataSourceProvider = Provider<ReferralRemoteDataSource>((
  ref,
) {
  return ReferralRemoteDataSourceImpl(ref);
});

// Provider for referral repository
final referralRepositoryProvider = Provider<ReferralRepository>((ref) {
  return ReferralRepositoryImpl(ref);
});
