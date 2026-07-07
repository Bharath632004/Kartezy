// lib/navigation/router.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/splash/pages/splash_screen.dart';
import 'package:customer_mobile/features/authentication/presentation/login_page.dart';
import 'package:customer_mobile/features/home/home_page.dart';
import 'package:customer_mobile/core/services/auth_service.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    refreshListenable: Listenable.merge([
      ref.read(authStateProvider),
    ]),
    redirect: (context, state) {
      final asyncAuth = ref.watch(authStateProvider);
      // If the auth state is still loading, we show a splash or loading page
      if (asyncAuth.isLoading) {
        return '/splash';
      }
      final loggedIn = asyncAuth.data ?? false;
      final loggingIn = state.subloc == '/login';
      final loggingOut = state.subloc == '/logout';
      // If not logged in and trying to access a protected route, redirect to login
      if (!loggedIn && !loggingIn && !state.subloc.startsWith('/splash')) {
        return '/login';
      }
      // If logged in and trying to access login page, redirect to home
      if (loggedIn && loggingIn) {
        return '/home';
      }
      return null; // No redirect needed
    },
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
  );
});