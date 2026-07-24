import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/splash/presentation/splash_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/login_page.dart';
import 'package:delivery_mobile/features/delivery_onboarding/onboarding_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/phone_login_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/otp_verification_page.dart';
import 'package:delivery_mobile/features/dashboard/presentation/dashboard_page.dart';
import 'package:delivery_mobile/features/profile/presentation/profile_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/available_orders_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/active_order_detail_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_history_page.dart';
import 'package:kartezy_core/services/auth_service.dart';
import 'package:kartezy_core/ui/mfa/mfa_verification_page.dart';
import 'package:kartezy_core/ui/mfa/mfa_enrollment_page.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final loggedIn = authState;
      final matchedLocation = state.matchedLocation;

      if (matchedLocation == '/splash') {
        return null;
      }

      final loggingIn = matchedLocation == '/login';
      final signingUp = matchedLocation == '/sign-up';
      final verifyingOtp = matchedLocation == '/otp-verification';
      final mfaVerify = matchedLocation == '/mfa-verify';
      final mfaEnroll = matchedLocation == '/mfa-enroll';
      final phoneLogin = matchedLocation == '/phone-login';

      if (!loggedIn &&
          !loggingIn &&
          !signingUp &&
          !verifyingOtp &&
          !mfaVerify &&
          !mfaEnroll &&
          !phoneLogin &&
          !matchedLocation.startsWith('/splash')) {
        return '/login';
      }
      if (loggedIn && (loggingIn || signingUp)) {
        return '/home';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(
        path: '/mfa-verify',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return MfaVerificationPage(
            email: extra?['email'] as String? ?? '',
            mfaSessionToken: extra?['mfaSessionToken'] as String? ?? '',
          );
        },
      ),
      GoRoute(
        path: '/mfa-enroll',
        builder: (context, state) => const MfaEnrollmentPage(),
      ),
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
      GoRoute(
        path: '/home',
        builder: (context, state) => const DashboardPage(),
        routes: [
          GoRoute(
            path: 'orders',
            builder: (context, state) => const AvailableOrdersPage(),
          ),
          GoRoute(
            path: 'history',
            builder: (context, state) => const OrderHistoryPage(),
          ),
        ],
      ),
      GoRoute(
        path: '/order/:id',
        builder: (context, state) {
          final orderId = state.pathParameters['id'] ?? '';
          return ActiveOrderDetailPage(orderId: orderId);
        },
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
    ],
  );
});
