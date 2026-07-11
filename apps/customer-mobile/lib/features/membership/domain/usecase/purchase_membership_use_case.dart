// lib/features/membership/domain/usecase/purchase_membership_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/membership/data/repository/membership_repository_impl.dart';
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';

class PurchaseMembershipUseCase {
  final MembershipRepository _repository;

  PurchaseMembershipUseCase(this._repository);

  Future<void> call(String planId) => _repository.purchaseMembership(planId);
}

/// Provider for purchase membership use case
final purchaseMembershipUseCaseProvider = Provider<PurchaseMembershipUseCase>((ref) {
  final repository = ref.read(membershipRepositoryProvider);
  return PurchaseMembershipUseCase(repository);
});