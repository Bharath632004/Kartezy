import 'package:kartezy_core/config/app_constants.dart';

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
}
