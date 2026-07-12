// lib/features/membership/data/datasource/membership_remote_data_source.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/models/membership.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

abstract class MembershipRemoteDataSource {
  Future<List<MembershipPlan>> getMembershipPlans();
  Future<Membership> getUserMembership(String userId);
  Future<bool> cancelMembership(String membershipId);
  Future<void> purchaseMembership(String planId);
  Future<void> renewMembership();
  Future<void> upgradeMembership(String newPlanId);
  Future<void> downgradeMembership(String newPlanId);
  Future<List<MembershipBenefit>> getMembershipBenefits();
}

class MembershipRemoteDataSourceImpl implements MembershipRemoteDataSource {
  final Ref _ref;

  MembershipRemoteDataSourceImpl(this._ref);

  @override
  Future<List<MembershipPlan>> getMembershipPlans() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/membership/plans');
    final List<dynamic> data = response.data;
    return data.map((json) => MembershipPlan.fromJson(json)).toList();
  }

  @override
  Future<Membership> getUserMembership(String userId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/membership/user/$userId');
    return Membership.fromJson(response.data);
  }

  @override
  Future<bool> cancelMembership(String membershipId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.delete('/membership/$membershipId/cancel');
    return response.data['success'] ?? false;
  }

  @override
  Future<void> purchaseMembership(String planId) async {
    final dioClient = _ref.read(dioProvider);
    await dioClient.post('/membership/purchase', data: {'planId': planId});
  }

  @override
  Future<void> renewMembership() async {
    final dioClient = _ref.read(dioProvider);
    await dioClient.post('/membership/renew');
  }

  @override
  Future<void> upgradeMembership(String newPlanId) async {
    final dioClient = _ref.read(dioProvider);
    await dioClient.post('/membership/upgrade', data: {'newPlanId': newPlanId});
  }

  @override
  Future<void> downgradeMembership(String newPlanId) async {
    final dioClient = _ref.read(dioProvider);
    await dioClient.post(
      '/membership/downgrade',
      data: {'newPlanId': newPlanId},
    );
  }

  @override
  Future<List<MembershipBenefit>> getMembershipBenefits() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/membership/benefits');
    final List<dynamic> data = response.data;
    return data.map((json) => MembershipBenefit.fromJson(json)).toList();
  }
}

/// Provider for membership remote data source
final membershipRemoteDataSourceProvider = Provider<MembershipRemoteDataSource>(
  (ref) {
    return MembershipRemoteDataSourceImpl(ref);
  },
);
