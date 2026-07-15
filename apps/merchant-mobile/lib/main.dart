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
  //  Register adapters for any Hive objects

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

      return Scaffold(
        body: Center(
          child: Text('Something went wrong'),
        ),
      );
    };

    return MaterialApp.router(
      title: 'Merchant App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}
