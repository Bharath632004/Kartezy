// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/core/storage/hive_manager.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:kratezy_core/core/theme/theme_provider.dart';
import 'package:delivery_mobile/navigation/router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  // Initialize Firebase
  await Firebase.initializeApp(
    options: FirebaseOptions(
      apiKey: dotenv.env['FIREBASE_API_KEY']!,
      appId: dotenv.env['FIREBASE_APP_ID']!,
      messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID']!,
      projectId: dotenv.env['FIREBASE_PROJECT_ID']!,
    ),
  );

  // Initialize Firebase Analytics
  FirebaseAnalytics.instance;

  // Initialize Firebase Messaging
  final status = await FirebaseMessaging.instance.requestPermission();
  if (status == AuthorizationStatus.authorized) {
    final token = await FirebaseMessaging.instance.getToken();
    if (token != null) {
      final secureStorage = SecureStorage();
      await secureStorage.write(key: 'fcmToken', value: token);
    }
  }

  // Handle token refresh
  FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
    final secureStorage = SecureStorage();
    await secureStorage.write(key: 'fcmToken', value: newToken);
  });

  // Pass all uncaught errors from the framework to Crashlytics.
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;

  // Initialize Hive
  final hiveManager = HiveManager();
  await hiveManager.init();

  runApp(
    ProviderScope(
      overrides: [
        // Override providers if needed for testing
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Get the current theme data from the provider
    final themeData = ref.watch(themeProvider);
    final goRouter = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'Kartezy Delivery Partner',
      theme: themeData,
      routerConfig: goRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
