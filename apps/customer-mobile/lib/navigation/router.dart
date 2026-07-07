// lib/navigation/router.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/splash/pages/splash_screen.dart';
import 'package:customer_mobile/features/authentication/pages/login_page.dart';
import 'package:customer_mobile/features/home/home_page.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
    ],
    // Redirect logic based on authentication status
    redirect: (context, state) {
      // TODO: Implement actual authentication check
      // For now, we'll just let the splash screen handle the redirect
      return null;
    },
  );
});