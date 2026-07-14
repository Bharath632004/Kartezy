// lib/features/referral/domain/usecase/get_referral_code_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class GetReferralCode implements UseCase<Referral, NoParams> {
  final ReferralRepository repository;

  GetReferralCode(this.repository);

  @override
  Future<Either<Failure, Referral>> call(NoParams params) async {
    return await repository.getReferralCode();
  }
}
