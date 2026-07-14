// lib/features/referral/domain/usecase/get_referral_code.dart
import '../../../../core/usecases/usecase.dart';
import '../repository/referral_repository.dart';

class GetReferralCode implements UseCase {
  final ReferralRepository repository;

  GetReferralCode(this.repository);

  Future<Referral> call() => repository.getReferralCode();
}
