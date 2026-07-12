// lib/features/membership/domain/usecase/get_membership_info_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/features/membership/data/repository/membership_repository_impl.dart';
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';
import 'package:customer_mobile/shared/models/membership.dart';

class GetMembershipInfoUseCase {
  final MembershipRepository _repository;

  GetMembershipInfoUseCase(this._repository);

  Future<Either<Exception, Membership>> call(String userId) async {
    try {
      final membership = await _repository.getMembershipInfo(userId);
      return Right(membership);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}

/// Provider for get membership info use case
final getMembershipInfoUseCaseProvider = Provider<GetMembershipInfoUseCase>((
  ref,
) {
  final repository = ref.read(membershipRepositoryProvider);
  return GetMembershipInfoUseCase(repository);
});
