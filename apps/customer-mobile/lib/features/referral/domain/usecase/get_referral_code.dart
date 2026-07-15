// lib/features/referral/domain/usecase/get_referral_code.dart
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/core/usecases/no_params.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';

class GetReferralCode implements UseCase<Referral, NoParams> {
  final ReferralRepository repository;

  GetReferralCode(this.repository);

  @override
  Future<Referral> call(NoParams params) => repository.getReferralCode();
}
