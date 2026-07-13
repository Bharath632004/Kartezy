// lib/features/referral/domain/usecase/validate_referral_code.dart
import '../../../../core/usecases/usecase.dart';
import '../repository/referral_repository.dart';

class ValidateReferralCode implements UseCase<bool, String> {
  final ReferralRepository repository;

  ValidateReferralCode(this.repository);

  @override
  Future<bool> call(String code) {
    return repository.validateReferralCode(code);
  }
}