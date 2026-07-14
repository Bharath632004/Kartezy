// lib/core/config/app_constants.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  // App name
  static String get appName => 'Kartezy';

  // App version
  static const String version = '1.0.0';

  // API base URL from environment variables
  static String get baseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'https://api.kartezy.com/api';

  // Firebase configuration from environment variables
  static String get firebaseApiKey => dotenv.env['FIREBASE_API_KEY'] ?? '';
  static String get firebaseAppId => dotenv.env['FIREBASE_APP_ID'] ?? '';
  static String get firebaseProjectId =>
      dotenv.env['FIREBASE_PROJECT_ID'] ?? '';

  // Pagination
  static const int itemsPerPage = 20;

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

  // Padding and radii
  static const double defaultPadding = 16.0;
  static const double avatarRadius = 24.0;
}
