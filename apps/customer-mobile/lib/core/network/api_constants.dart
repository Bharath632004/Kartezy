// lib/core/config/api_constants.dart
import 'package:customer_mobile/core/config/app_constants.dart';

class ApiConstants {
  static String get baseUrl => AppConstants.baseUrl;

  // Endpoints
  static const String cart = 'cart';
  static const String order = 'order';
  static const String payment = 'payment';
  static const String wallet = 'wallet';
  static const String coupon = 'coupon';
  static const String address = 'address';
  static const String product = 'product';
  static const String inventory = 'inventory';
  static const String pricing = 'pricing';
  static const String user = 'user';
  static const String notificationsEndpoint = 'notifications';

  // Referral endpoints
  static const String getReferralCode = 'referral/code';
  static const String shareReferralCode = 'referral/share';
  static const String getReferralHistory = 'referral/history';
  static const String validateReferralCode = 'referral/validate';

  // Support endpoints
  static const String supportTickets = 'support/tickets';
  static const String feedback = 'support/feedback';
}
