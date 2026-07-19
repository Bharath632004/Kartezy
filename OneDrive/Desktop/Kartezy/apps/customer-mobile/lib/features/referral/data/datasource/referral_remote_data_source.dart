// lib/features/referral/data/datasource/referral_remote_data_source.dart
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';

abstract class ReferralRemoteDataSource {
  Future<Referral> getReferralCode();
  Future<void> shareReferralCode(String code, String method);
  Future<List<Referral>> getReferralHistory();
  Future<bool> validateReferralCode(String code);
}
