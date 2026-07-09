// lib/features/membership/domain/usecase/get_membership_info_use_case.dart
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';
import 'package:customer_mobile/shared/models/membership.dart';

class GetMembershipInfoUseCase {
  final MembershipRepository _repository;

  GetMembershipInfoUseCase(this._repository);

  Future<MembershipUser> call() => _repository.getMembershipInfo();
}

/// Provider for get membership info use case
final getMembershipInfoUseCaseProvider = Provider<GetMembershipInfoUseCase>((ref) {
  final repository = ref.read(membershipRepositoryProvider);
  return GetMembershipInfoUseCase(repository);
});