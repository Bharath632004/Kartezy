import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:kartezy_core/theme/theme_provider.dart';
import 'package:delivery_mobile/navigation/router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: '.env');

  // Initialize Hive for local storage
  final hiveManager = HiveManager();
  await hiveManager.init();

  // Initialize Firebase (wrapped in try-catch for development)
  // try {
  //   await Firebase.initializeApp();
  // } catch (e) {
  //   debugPrint('Firebase init skipped in development: $e');
  // }

  runApp(ProviderScope(overrides: const [], child: const DeliveryPartnerApp()));
}

/// Root widget of the Delivery Partner Application.
class DeliveryPartnerApp extends ConsumerWidget {
  const DeliveryPartnerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeData = ref.watch(themeProvider);
    final goRouter = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'Kartezy Delivery Partner',
      theme: themeData,
      routerConfig: goRouter,
      debugShowCheckedModeBanner: false,
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(
              MediaQuery.of(context).textScaler.scale(1.0).clamp(0.8, 2.0),
            ),
          ),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
