import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/models/membership.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

abstract class MembershipRemoteDataSource {
  Future<List<Membership>> getMembershipPlans();
  Future<Membership> purchaseMembership(String planId);
  Future<Membership> getUserMembership(String userId);
  Future<bool> cancelMembership(String membershipId);
}

class MembershipRemoteDataSourceImpl implements MembershipRemoteDataSource {
  final Ref _ref;

  MembershipRemoteDataSourceImpl(this._ref);

  @override
  Future<List<Membership>> getMembershipPlans() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/membership/plans');
    final List<dynamic> data = response.data;
    return data.map((json) => Membership.fromJson(json)).toList();
  }

  @override
  Future<Membership> purchaseMembership(String planId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.post(
      '/membership/purchase',
      data: {'planId': planId},
    );
    return Membership.fromJson(response.data);
  }

  @override
  Future<Membership> getUserMembership(String userId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get(
      '/membership/user/$userId',
    );
    return Membership.fromJson(response.data);
  }

  @override
  Future<bool> cancelMembership(String membershipId) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.delete(
      '/membership/$membershipId/cancel',
    );
    return response.data['success'] ?? false;
  }
}

/// Provider for membership remote data source
final membershipRemoteDataSourceProvider =
    Provider<MembershipRemoteDataSource>((ref) {
  return MembershipRemoteDataSourceImpl(ref);
});