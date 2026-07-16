import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:kartezy_core/theme/theme_provider.dart';
import 'package:delivery_mobile/navigation/router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');

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
