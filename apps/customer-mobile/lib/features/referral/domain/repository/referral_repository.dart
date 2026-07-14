// lib/features/referral/domain/repository/referral_repository.dart
import '../../entities/referral.dart';

abstract class ReferralRepository {
  Future<Referral> getReferralCode();
  Future<void> shareReferralCode(String code, String method);
  Future<List<Referral>> getReferralHistory();
  Future<bool> validateReferralCode(String code);
}
