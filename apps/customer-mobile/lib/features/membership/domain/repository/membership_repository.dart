// lib/features/membership/domain/repository/membership_repository.dart
import 'package:customer_mobile/shared/models/membership.dart';

abstract class MembershipRepository {
  Future<List<MembershipPlan>> getMembershipPlans();
  Future<MembershipUser> getMembershipInfo();
  Future<void> purchaseMembership(String planId);
  Future<void> renewMembership();
  Future<void> upgradeMembership(String newPlanId);
  Future<void> downgradeMembership(String newPlanId);
  Future<List<MembershipBenefit>> getMembershipBenefits();
}