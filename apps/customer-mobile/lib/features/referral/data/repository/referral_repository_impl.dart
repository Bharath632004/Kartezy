// lib/features/referral/data/repository/referral_repository_impl.dart
import 'package:customer_mobile/features/referral/data/datasource/referral_remote_data_source.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class ReferralRepositoryImpl implements ReferralRepository {
  final ReferralRemoteDataSource _remoteDataSource;

  ReferralRepositoryImpl(this._remoteDataSource);

  @override
  Future<Referral> getReferralCode() async {
    return await _remoteDataSource.getReferralCode();
  }

  @override
  Future<void> shareReferralCode(String code, String method) async {
    await _remoteDataSource.shareReferralCode(code, method);
  }

  @override
  Future<List<Referral>> getReferralHistory() async {
    return await _remoteDataSource.getReferralHistory();
  }

  @override
  Future<bool> validateReferralCode(String code) async {
    return await _remoteDataSource.validateReferralCode(code);
  }
}
