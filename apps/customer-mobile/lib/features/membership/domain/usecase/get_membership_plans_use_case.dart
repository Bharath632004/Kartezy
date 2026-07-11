// lib/features/membership/domain/usecase/get_membership_plans_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/membership/data/repository/membership_repository_impl.dart';
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';
import 'package:customer_mobile/shared/models/membership.dart';

class GetMembershipPlansUseCase {
  final MembershipRepository _repository;

  GetMembershipPlansUseCase(this._repository);

  Future<List<MembershipPlan>> call() => _repository.getMembershipPlans();
}

/// Provider for get membership plans use case
final getMembershipPlansUseCaseProvider = Provider<GetMembershipPlansUseCase>((ref) {
  final repository = ref.read(membershipRepositoryProvider);
  return GetMembershipPlansUseCase(repository);
});