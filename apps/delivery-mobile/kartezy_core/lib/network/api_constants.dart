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

  // Delivery Partner Auth Endpoints
  static const String deliveryPartnerAuthLogin = 'delivery/auth/login';
  static const String deliveryPartnerAuthLogout = 'delivery/auth/logout';
  static const String deliveryPartnerAuthRefresh = 'delivery/auth/refresh';
  static const String deliveryPartnerAuthSendOtp = 'delivery/auth/send-otp';
  static const String deliveryPartnerAuthVerifyOtp = 'delivery/auth/verify-otp';
  static const String deliveryPartnerAuthRegister = 'delivery/auth/register';
  
  // Delivery Partner Dashboard
  static const String deliveryDashboard = 'delivery/dashboard';
  
  // Delivery Partner Orders
  static const String deliveryAvailableOrders = 'delivery/orders/available';
  static const String deliveryAcceptOrder = 'delivery/orders/accept';
  static const String deliveryRejectOrder = 'delivery/orders/reject';
  static const String deliveryPickupOrder = 'delivery/orders/pickup';
  static const String deliveryDeliverOrder = 'delivery/orders/deliver';
  static const String deliveryOrderHistory = 'delivery/orders/history';
  static const String deliveryOrderTimeline = 'delivery/orders/timeline';
  static const String deliveryVerifyOtp = 'delivery/orders/verify-otp';
  static const String deliverySubmitProof = 'delivery/orders/proof-of-delivery';
  
  // Delivery Partner Wallet
  static const String deliveryWalletBalance = 'delivery/wallet/balance';
  static const String deliveryWalletTransactions = 'delivery/wallet/transactions';
  static const String deliveryWalletWithdraw = 'delivery/wallet/withdraw';
  
  // Delivery Partner Navigation
  static const String deliveryNavigationDirections = 'delivery/navigation/directions';
  static const String deliveryNavigationLocation = 'delivery/navigation/location';
  static const String deliveryNavigationCancel = 'delivery/navigation/cancel';
}
