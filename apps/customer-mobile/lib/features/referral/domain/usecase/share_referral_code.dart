// lib/features/referral/domain/usecase/share_referral_code.dart
import '../../../../core/usecases/usecase.dart';
import '../repository/referral_repository.dart';

class ShareReferralCode implements UseCase<void, Params> {
  final ReferralRepository repository;

  ShareReferralCode(this.repository);

  @override
  Future<void> call(Params params) {
    final Map<String, dynamic> data = params.data as Map<String, dynamic>;
    final String code = data['code'] as String;
    final String method = data['method'] as String;
    return repository.shareReferralCode(code, method);
  }
}

class Params {
  final Map<String, dynamic> data;

  const Params({required this.data});
}
