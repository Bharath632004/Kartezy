// lib/features/referral/domain/usecase/get_referral_code.dart
import '../../../../core/usecases/usecase.dart';
import '../../../../core/usecases/no_params.dart';
import '../repository/referral_repository.dart';

class GetReferralCode implements UseCase<Referral, NoParams> {
  final ReferralRepository repository;

  GetReferralCode(this.repository);

  @override
  Future<Referral> call(NoParams params) => repository.getReferralCode();
}