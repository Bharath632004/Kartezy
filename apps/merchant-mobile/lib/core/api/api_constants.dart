class ApiConstants {
  static const String baseUrl = 'https://api.example.com/api/v1/';

  // Auth endpoints
  static const String login = 'auth/login';
  static const String register = 'auth/register';
  static const String refreshToken = 'auth/refresh-token';
  static const String logout = 'auth/logout';
  static const String sendOtp = 'auth/send-otp';
  static const String verifyOtp = 'auth/verify-otp';

  // Merchant endpoints
  static const String merchantRegister = 'merchant/register';
  static const String merchantProfile = 'merchant/profile';
  static const String merchantUpdateProfile = 'merchant/update-profile';
  static const String merchantBusinessSettings = 'merchant/business-settings';

  // Dashboard endpoints
  static const String dashboardStats = 'dashboard/stats';
  static const String merchantOrders = 'merchant/orders';
  static const String merchantAnalytics = 'merchant/analytics';

  // Common endpoints
  static const String user = 'user';
  static const String address = 'address';
}