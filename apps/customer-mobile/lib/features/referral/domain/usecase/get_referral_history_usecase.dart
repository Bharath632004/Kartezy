// lib/features/referral/domain/usecase/get_referral_history_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/features/referral/domain/entities/referral.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class GetReferralHistory implements UseCase<List<Referral>, NoParams> {
  final ReferralRepository repository;

  GetReferralHistory(this.repository);

  @override
  Future<Either<Failure, List<Referral>>> call(NoParams params) async {
    return await repository.getReferralHistory();
  }
}
