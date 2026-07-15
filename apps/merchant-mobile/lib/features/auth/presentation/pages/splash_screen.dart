import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';
import 'package:merchant_mobile/core/storage/hive_manager.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await Future.delayed(const Duration(seconds: 2));

    final hasSeenOnboarding = await ref
        .read(hiveManagerProvider)
        .getHasSeenOnboarding();

    if (!mounted) return;

    if (!hasSeenOnboarding) {
      context.go('/onboarding');
      return;
    }

    final isLoggedIn = await ref.read(authServiceProvider).isLoggedIn();
    if (!mounted) return;

    if (isLoggedIn) {
      context.go('/dashboard');
    } else {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.store, size: 80, color: Colors.deepPurple),
            SizedBox(height: 24),
            Text(
              'Kartzezy Merchant',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.deepPurple,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
