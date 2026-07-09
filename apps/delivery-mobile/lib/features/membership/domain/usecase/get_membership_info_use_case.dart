// lib/features/membership/domain/usecase/get_membership_info_use_case.dart
import 'package:dartz/dartz.dart';
import 'package:customer_mobile/core/error/failures.dart';
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';

class GetMembershipInfoUseCase {
  final MembershipRepository repository;

  GetMembershipInfoUseCase(this.repository);

  Future<Either<Failure, Membership>> call(String userId) =>
      repository.getMembershipInfo(userId);
}