// lib/features/splash/presentation/splash_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/splash/provider/splash_provider.dart';
import 'package:delivery_mobile/features/delivery_onboarding/presentation/onboarding_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/phone_login_page.dart';
import 'package:delivery_mobile/features/dashboard/presentation/dashboard_page.dart'; //  Create this

class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage> {
  bool _hasNavigated = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final splashState = ref.read(splashProvider);

    // If we have a next route and haven't navigated yet, navigate
    if (splashState.nextRoute != null && !_hasNavigated) {
      _hasNavigated = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        // Navigate to the next route
        goRouter.go(splashState.nextRoute!);
      });
    }

    // If there's an error, show a snackbar
    if (splashState.error != null && !_hasNavigated) {
      _hasNavigated = true; // Prevent multiple snacbars
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${splashState.error}')),
        );
        // On error, we might want to go to login or stay on splash? Let's go to login.
        goRouter.go('/login');
      });
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final splashState = ref.watch(splashProvider);

    return Scaffold(
      body: Center(
        child: splashState.isLoading
            ? const CircularProgressIndicator()
            : const Icon(
                Icons.local_shipping,
                size: 100,
                color: Colors.blue,
              ),
      ),
    );
  }
}
