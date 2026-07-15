// lib/features/referral/domain/usecase/get_referral_history.dart
import '../../../../core/usecases/usecase.dart';
import '../../../../core/usecases/no_params.dart';
import '../repository/referral_repository.dart';

class GetReferralHistory implements UseCase<List<Referral>, NoParams> {
  final ReferralRepository repository;

  GetReferralHistory(this.repository);

  @override
  Future<List<Referral>> call(NoParams params) => repository.getReferralHistory();
}