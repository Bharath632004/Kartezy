// lib/features/membership/data/repository/membership_repository_impl.dart
 .data/repository/membership_repository_impl.dart
import 'package:customer_mobile/features/membership/data/datasource/membership_remote_data_source.dart';
import 'package:customer_mobile/features/membership/domain/repository/membership_repository.dart';
import 'package:customer_mobile/shared/models/membership.dart';

class MembershipRepositoryImpl implements MembershipRepository {
  final MembershipRemoteDataSource _remoteDataSource;

  MembershipRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<MembershipPlan>> getMembershipPlans() =>
      _remoteDataSource.getMembershipPlans();

  @override
  Future<Membership> getMembershipInfo(String userId) =>
      _remoteDataSource.getUserMembership(userId);

  @override
  Future<void> purchaseMembership(String planId) =>
      _remoteDataSource.purchaseMembership(planId);

  @override
  Future<void> renewMembership() =>
      _remoteDataSource.renewMembership();

  @override
  Future<void> upgradeMembership(String newPlanId) =>
      _remoteDataSource.upgradeMembership(newPlanId);

  @override
  Future<void> downgradeMembership(String newPlanId) =>
      _remoteDataSource.downgradeMembership(newPlanId);

  @override
  Future<List<MembershipBenefit>> getMembershipBenefits() =>
      _remoteDataSource.getMembershipBenefits();
}

/// Provider for membership repository
final membershipRepositoryProvider = Provider<MembershipRepository>((ref) {
  final remoteDataSource = ref.read(membershipRemoteDataSourceProvider);
  return MembershipRepositoryImpl(remoteDataSource);
});