// lib/features/referral/domain/usecase/get_referral_history.dart
import '../../../../core/usecases/usecase.dart';
import '../repository/referral_repository.dart';

class GetReferralHistory implements UseCase {
  final ReferralRepository repository;

  GetReferralHistory(this.repository);

  Future<List<Referral>> call() => repository.getReferralHistory();
}
