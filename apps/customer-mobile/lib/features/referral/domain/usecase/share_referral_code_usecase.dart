// lib/features/referral/domain/usecase/share_referral_code_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class ShareReferralCode implements UseCase<void, ShareReferralCodeParams> {
  final ReferralRepository repository;

  ShareReferralCode(this.repository);

  @override
  Future<Either<Failure, void>> call(ShareReferralCodeParams params) async {
    return await repository.shareReferralCode(params.code, params.method);
  }
}

class ShareReferralCodeParams {
  final String code;
  final String method;

  ShareReferralCodeParams({required this.code, required this.method});
}
