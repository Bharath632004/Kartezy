import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'Kartezy';
  static const String version = '1.0.0';

  // Pagination
  static const int itemsPerPage = 10;

  // API
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080',
  );
  static const Duration apiTimeout = Duration(seconds: 30);

  // Default currency
  static const String defaultCurrency = 'INR';
  static const String currencySymbol = '₹';

  // Delivery charges
  static const double standardDeliveryCharge = 29.0;
  static const double freeDeliveryThreshold = 199.0;

  // Platform fee
  static const double platformFee = 3.0;

  // GST percentage
  static const double gstPercentage = 18.0;

  // Packaging fee
  static const double packagingFee = 5.0;

  // Wallet bonus percentage
  static const double walletBonusPercentage = 5.0;

  // Reward points conversion
  static const int pointsPerCurrencyUnit = 10;

  // Membership plans
  static const List<String> membershipDurations = ['monthly', 'yearly'];

  // Location defaults
  static const double defaultLatitude = 12.9716;
  static const double defaultLongitude = 77.5946;

  // Theme
  static const Color primaryColor = Color(0xFF1976D2);
  static const Color accentColor = Color(0xFF388E3C);
  static const Color errorColor = Color(0xFFD32F2F);
  static const Color warningColor = Color(0xFFF57C00);
}
