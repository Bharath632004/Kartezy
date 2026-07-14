// lib/core/constants/app_constants.dart
class AppConstants {
  static const String appName = 'Kartezy';
  static const String version = '1.0.0';

  // Pagination
  static const int itemsPerPage = 10;

  // Timeouts
  static const Duration apiTimeout = Duration(seconds: 30);

  // Image placeholders
  static const String placeholderImage = 'assets/images/placeholder.png';

  // Default currency
  static const String defaultCurrency = 'USD';

  // Delivery charges
  static const double standardDeliveryCharge = 5.0;
  static const double freeDeliveryThreshold = 50.0;

  // Platform fee percentage
  static const double platformFeePercentage = 2.5;

  // GST percentage
  static const double gstPercentage = 18.0;

  // Packaging fee
  static const double packagingFee = 2.0;

  // Wallet bonus percentage
  static const double walletBonusPercentage = 5.0;

  // Reward points conversion
  static const int pointsPerCurrencyUnit =
      10; // 10 points per 1 unit of currency

  // Subscription plans
  static const List<String> membershipDurations = ['monthly', 'yearly'];
}
