// lib/core/config/app_constants.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  // API base URL from environment variables
  static String get baseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'https://api.kartezy.com/api';

  // Firebase configuration from environment variables
  static String get firebaseApiKey => dotenv.env['FIREBASE_API_KEY'] ?? '';
  static String get firebaseAppId => dotenv.env['FIREBASE_APP_ID'] ?? '';
  static String get firebaseProjectId =>
      dotenv.env['FIREBASE_PROJECT_ID'] ?? '';
}
