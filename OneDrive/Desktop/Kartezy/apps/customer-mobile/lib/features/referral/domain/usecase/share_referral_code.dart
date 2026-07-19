// lib/features/referral/domain/usecase/share_referral_code.dart
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/features/referral/domain/repository/referral_repository.dart';

class ShareReferralCode implements UseCase<void, ShareReferralCodeParams> {
  final ReferralRepository repository;

  ShareReferralCode(this.repository);

  @override
  Future<void> call(ShareReferralCodeParams params) {
    return repository.shareReferralCode(params.code, params.method);
  }
}

class ShareReferralCodeParams {
  final String code;
  final String method;

  ShareReferralCodeParams({required this.code, required this.method});
}
