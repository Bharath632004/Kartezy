// lib/features/referral/domain/usecase/validate_referral_code_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class ValidateReferralCode implements UseCase<bool, String> {
  final ReferralRepository repository;

  ValidateReferralCode(this.repository);

  @override
  Future<Either<Failure, bool>> call(String code) async {
    return await repository.validateReferralCode(code);
  }
}
