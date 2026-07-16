// lib/core/config/app_constants.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  // App name
  static String get appName => 'Kartezy';

  // API base URL from environment variables
  static String get baseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'https://api.kartezy.com/api';

  // Firebase configuration from environment variables
  static String get firebaseApiKey => dotenv.env['FIREBASE_API_KEY'] ?? '';
  static String get firebaseAppId => dotenv.env['FIREBASE_APP_ID'] ?? '';
  static String get firebaseProjectId =>
      dotenv.env['FIREBASE_PROJECT_ID'] ?? '';

  // Other constants
  static const double defaultPadding = 16.0;
  static const double avatarRadius = 24.0;
  static const int itemsPerPage = 20;
  static String get googleMapsApiKey => dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';
}
