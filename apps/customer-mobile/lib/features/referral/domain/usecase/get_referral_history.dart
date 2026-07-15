// lib/features/referral/domain/usecase/get_referral_history.dart
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/core/usecases/no_params.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';

class GetReferralHistory implements UseCase<List<Referral>, NoParams> {
  final ReferralRepository repository;

  GetReferralHistory(this.repository);

  @override
  Future<List<Referral>> call(NoParams params) => repository.getReferralHistory();
}
