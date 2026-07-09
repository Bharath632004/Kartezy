// lib/features/membership/data/datasource/membership_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/shared/models/membership.dart';

class MembershipRemoteDataSource {
  final Dio _dio;

  MembershipRemoteDataSource(this._dio);

  Future<List<MembershipPlan>> getMembershipPlans() async {
    final response = await _dio.get('/membership/plans');
    final List<dynamic> data = response.data;
    return data.map((e) => MembershipPlan.fromJson(e)).toList();
  }

  Future<MembershipUser> getMembershipInfo() async {
    final response = await _dio.get('/membership/info');
    return MembershipUser.fromJson(response.data);
  }

  Future<void> purchaseMembership(String planId) async {
    await _dio.post('/membership/purchase', data: {
      'plan_id': planId,
    });
  }

  Future<void> renewMembership() async {
    await _dio.post('/membership/renew');
  }

  Future<void> upgradeMembership(String newPlanId) async {
    await _dio.post('/membership/upgrade', data: {
      'new_plan_id': newPlanId,
    });
  }

  Future<void> downgradeMembership(String newPlanId) async {
    await _dio.post('/membership/downgrade', data: {
      'new_plan_id': newPlanId,
    });
  }

  Future<List<MembershipBenefit>> getMembershipBenefits() async {
    final response = await _dio.get('/membership/benefits');
    final List<dynamic> data = response.data;
    return data.map((e) => MembershipBenefit.fromJson(e)).toList();
  }
}

/// Provider for membership remote data source
final membershipRemoteDataSourceProvider =
    Provider<MembershipRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return MembershipRemoteDataSource(dio);
});