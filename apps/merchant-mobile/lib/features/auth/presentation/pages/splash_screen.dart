import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Initialize services and then navigate
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Wait for a moment to show the splash screen
    await Future.delayed(const Duration(seconds: 2));

    // Check if the user has seen the onboarding
    final hasSeenOnboarding =
        await ref.read(hiveManagerProvider).getHasSeenOnboarding();

    if (!mounted) return;

    if (!hasSeenOnboarding) {
      // Go to onboarding
      GoRouter.of(context).go('/onboarding');
    } else {
      // Check if user is logged in
      final isLoggedIn =
          await ref.read(authServiceProvider).isLoggedIn();
      if (isLoggedIn) {
        GoRouter.of(context).go('/dashboard');
      } else {
        GoRouter.of(context).go('/login');
      }
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
            Icon(
              Icons.store,
              size: 80,
              color: Colors.deepPurple,
            ),
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