import 'package:delivery_mobile/core/config/app_constants.dart';

class ApiConstants {
  static String get baseUrl => AppConstants.baseUrl;

  // Delivery Partner Auth Endpoints
  static const String deliveryPartnerAuthLogin = 'delivery-partner/auth/login';
  static const String deliveryPartnerAuthLogout = 'delivery-partner/auth/logout';
  static const String deliveryPartnerAuthRefresh = 'delivery-partner/auth/refresh';
  static const String deliveryPartnerAuthSendOtp = 'delivery-partner/auth/send-otp';
  static const String deliveryPartnerAuthVerifyOtp = 'delivery-partner/auth/verify-otp';
  static const String deliveryPartnerAuthRegister = 'delivery-partner/auth/register';

  // Other endpoints (common or for other features)
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
  // Add more as needed
}
