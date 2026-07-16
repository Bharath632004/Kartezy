import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:merchant_mobile/core/firebase/firebase_service.dart';
import 'package:merchant_mobile/core/logger/logger_service.dart';
import 'package:merchant_mobile/routes/app_router.dart';
import 'package:flutter/foundation.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive
  await Hive.initFlutter();
  // Register adapters for any Hive objects

  // Initialize services
  await FirebaseService.instance.initialize();
  LoggerService.instance.init();

  // Set up error handling
  FlutterError.onError = (FlutterErrorDetails details) {
    LoggerService.instance.e(
      'Flutter Error',
      error: details.exception,
      stackTrace: details.stack,
    );
    FirebaseService.instance.recordError(
      details.exception,
      details.stack ?? StackTrace.current,
    );
  };

  // Platform dispatcher errors (for Flutter errors in release)
  if (!kIsWeb) {
    PlatformDispatcher.instance.onError = (error, stack) {
      LoggerService.instance.e(
        'Platform Dispatcher Error',
        error: error,
        stackTrace: stack,
      );
      FirebaseService.instance.recordError(error, stack);
      return true;
    };
  }

  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);

    // Set the error widget builder
    ErrorWidget.builder = (FlutterErrorDetails details) {
      LoggerService.instance.e(
        'UI Error',
        error: details.exception,
        stackTrace: details.stack,
      );
      FirebaseService.instance.recordError(
        details.exception,
        details.stack ?? StackTrace.current,
      );

      return Material(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
                const SizedBox(height: 16),
                const Text(
                  'Something went wrong',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Please try restarting the app',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ),
      );
    };

    return MaterialApp.router(
      title: 'Kartezy Merchant',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6750A4), // Deep Purple seed
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          scrolledUnderElevation: 1,
        ),
        cardTheme: CardThemeData(
          elevation: 1,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          clipBehavior: Clip.antiAlias,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.grey[50],
        ),
        chipTheme: ChipThemeData(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        dividerTheme: DividerThemeData(
          space: 1,
          thickness: 1,
          color: Colors.grey[200],
        ),
      ),
      routerConfig: router,
    );
  }
}
