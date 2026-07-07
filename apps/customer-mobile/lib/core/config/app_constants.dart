// lib/core/config/app_constants.dart
class AppConstants {
  // App name
  static const String appName = 'Kartezy';

  // API base URL (should be replaced with actual backend URL)
  static const String baseUrl = 'https://api.kartezy.com/api';

  // Firebase configuration (if needed, but we'll use firebase_core)
  // These are placeholders; in reality, you'd use google-services.json and GoogleService-Info.plist
  static const String firebaseApiKey = 'YOUR_FIREBASE_API_KEY';
  static const String firebaseAppId = 'YOUR_FIREBASE_APP_ID';
  static const String firebaseProjectId = 'YOUR_FIREBASE_PROJECT_ID';

  // Other constants
  static const double defaultPadding = 16.0;
  static const double avatarRadius = 24.0;
  static const int itemsPerPage = 20;
}