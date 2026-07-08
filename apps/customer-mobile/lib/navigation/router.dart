// lib/navigation/router.dart
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/splash/pages/splash_screen.dart';
import 'package:customer_mobile/features/authentication/presentation/login_page.dart';
import 'package:customer_mobile/features/home/home_page.dart';
import 'package:customer_mobile/features/onboarding/onboarding_page.dart';
import 'package:customer_mobile/features/authentication/presentation/phone_login_page.dart';
import 'package:customer_mobile/features/authentication/presentation/otp_verification_page.dart';
import 'package:customer_mobile/features/profile/presentation/profile_page.dart';
import 'package:customer_mobile/core/services/auth_service.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    refreshListenable: [
      ref.read(authStateProvider.notifier),
      ref.read(initializeAuthProvider.notifier),
    ],
    redirect: (context, state) {
      final authState = ref.watch(authStateProvider);
      final isInitializing = ref.watch(initializeAuthProvider).maybeWhen(
        loading: () => true,
        error: () => false,
        data: (_) => false,
      );

      if (isInitializing) {
        return '/splash';
      }

      final loggedIn = authState;
      final loggingIn = state.location == '/login';
      final loggingOut = state.location == '/logout';
      final signingUp = state.location == '/sign-up';
      final verifyingOtp = state.location == '/otp-verification';
      final phoneLogin = state.location == '/phone-login';
      // If not logged in and trying to access a protected route, redirect to login
      if (!loggedIn &&
          !loggingIn &&
          !signingUp &&
          !verifyingOtp &&
          !phoneLogin &&
          !state.location.startsWith('/splash')) {
        return '/login';
      }
      // If logged in and trying to access login or sign up page, redirect to home
      if (loggedIn && (loggingIn || signingUp)) {
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
        path: '/onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(
        path: '/phone-login',
        builder: (context, state) => const PhoneLoginPage(),
      ),
      GoRoute(
        path: '/otp-verification',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          final phoneNumber = extra?['phoneNumber'] as String?;
          return OtpVerificationPage(phoneNumber: phoneNumber ?? '');
        },
      ),
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
    ],
  );
});