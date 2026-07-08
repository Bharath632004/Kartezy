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

final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    refreshListenable: Listenable.merge([ref.read(authStateProvider)]),
    redirect: (context, state) {
      final authState = ref.watch(authStateProvider);
      if (authState.isLoading) {
        return '/splash';
      }
      final loggedIn = authState.valueOrNull ?? false;
      final loggingIn = state.subloc == '/login';
      final loggingOut = state.subloc == '/logout';
      final signingUp = state.subloc == '/sign-up';
      final verifyingOtp = state.subloc == '/otp-verification';
      final phoneLogin = state.subloc == '/phone-login';
      // If not logged in and trying to access a protected route, redirect to login
      if (!loggedIn &&
          !loggingIn &&
          !signingUp &&
          !verifyingOtp &&
          !phoneLogin &&
          !state.subloc.startsWith('/splash')) {
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
      GoRoute(path: '/profile', builder: (context, state) => const ProfilePage()),
    ],
  );
});
