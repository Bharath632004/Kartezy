import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/splash/presentation/splash_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/login_page.dart';
import 'package:delivery_mobile/features/delivery_onboarding/onboarding_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/phone_login_page.dart';
import 'package:delivery_mobile/features/authentication/presentation/otp_verification_page.dart';
import 'package:delivery_mobile/features/dashboard/presentation/dashboard_page.dart';
import 'package:delivery_mobile/features/dashboard/presentation/main_shell.dart';
import 'package:delivery_mobile/features/profile/presentation/profile_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_discovery_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/active_order_detail_page.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_history_page.dart';
import 'package:delivery_mobile/features/earnings_wallet/presentation/earnings_page.dart';
import 'package:delivery_mobile/features/navigation/presentation/navigation_page.dart';
import 'package:delivery_mobile/features/performance/presentation/performance_page.dart';
import 'package:delivery_mobile/features/notifications/presentation/notifications_page.dart';
import 'package:delivery_mobile/features/chat/presentation/chat_list_page.dart';
import 'package:delivery_mobile/features/safety/presentation/safety_page.dart';
import 'package:delivery_mobile/features/support/presentation/support_page.dart';
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

      if (matchedLocation == '/splash') return null;

      final publicRoutes = [
        '/login',
        '/sign-up',
        '/otp-verification',
        '/mfa-verify',
        '/mfa-enroll',
        '/phone-login',
        '/onboarding',
      ];
      final isPublicRoute = publicRoutes.any(
        (r) => matchedLocation.startsWith(r),
      );

      if (!loggedIn &&
          !isPublicRoute &&
          !matchedLocation.startsWith('/splash')) {
        return '/login';
      }
      if (loggedIn &&
          (matchedLocation == '/login' || matchedLocation == '/sign-up')) {
        return '/home';
      }
      return null;
    },
    routes: [
      // Splash
      GoRoute(path: '/splash', builder: (ctx, state) => const SplashPage()),
      // Onboarding
      GoRoute(
        path: '/onboarding',
        builder: (ctx, state) => const OnboardingPage(),
      ),
      // Auth
      GoRoute(path: '/login', builder: (ctx, state) => const LoginPage()),
      GoRoute(
        path: '/phone-login',
        builder: (ctx, state) => const PhoneLoginPage(),
      ),
      GoRoute(
        path: '/mfa-verify',
        builder: (ctx, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return MfaVerificationPage(
            email: extra?['email'] as String? ?? '',
            mfaSessionToken: extra?['mfaSessionToken'] as String? ?? '',
          );
        },
      ),
      GoRoute(
        path: '/mfa-enroll',
        builder: (ctx, state) => const MfaEnrollmentPage(),
      ),
      GoRoute(
        path: '/otp-verification',
        builder: (ctx, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return OtpVerificationPage(
            phoneNumber: extra?['phoneNumber'] as String? ?? '',
          );
        },
      ),
      // Main Shell with bottom navigation
      ShellRoute(
        builder: (ctx, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (ctx, state) => const DashboardPage(),
          ),
          GoRoute(
            path: '/home/orders',
            builder: (ctx, state) => const OrderDiscoveryPage(),
          ),
          GoRoute(
            path: '/home/history',
            builder: (ctx, state) => const OrderHistoryPage(),
          ),
        ],
      ),
      // Order Detail
      GoRoute(
        path: '/order/:id',
        builder: (ctx, state) {
          final orderId = state.pathParameters['id'] ?? '';
          return ActiveOrderDetailPage(orderId: orderId);
        },
      ),
      // Earnings & Wallet
      GoRoute(path: '/earnings', builder: (ctx, state) => const EarningsPage()),
      GoRoute(
        path: '/wallet/withdraw',
        builder: (ctx, state) => const EarningsPage(),
      ),
      GoRoute(
        path: '/wallet/history',
        builder: (ctx, state) => const EarningsPage(),
      ),
      // Profile
      GoRoute(path: '/profile', builder: (ctx, state) => const ProfilePage()),
      GoRoute(
        path: '/profile/vehicle',
        builder: (ctx, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/profile/documents',
        builder: (ctx, state) => const ProfilePage(),
      ),
      // Navigation
      GoRoute(
        path: '/navigation',
        builder: (ctx, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return NavigationPage(
            destinationName: extra?['name'] as String?,
            destinationLatitude: extra?['latitude'] as double?,
            destinationLongitude: extra?['longitude'] as double?,
            orderId: extra?['orderId'] as String?,
          );
        },
      ),
      // Performance
      GoRoute(
        path: '/performance',
        builder: (ctx, state) => const PerformancePage(),
      ),
      GoRoute(
        path: '/leaderboard',
        builder: (ctx, state) => const PerformancePage(),
      ),
      // Chat
      GoRoute(path: '/chat', builder: (ctx, state) => const ChatListPage()),
      GoRoute(
        path: '/chat/room',
        builder: (ctx, state) => const ChatListPage(),
      ),
      GoRoute(
        path: '/chat/order/:id',
        builder: (ctx, state) => const ChatListPage(),
      ),
      // Notifications
      GoRoute(
        path: '/notifications',
        builder: (ctx, state) => const NotificationsPage(),
      ),
      // Safety
      GoRoute(path: '/safety', builder: (ctx, state) => const SafetyPage()),
      GoRoute(
        path: '/safety/trusted-contacts',
        builder: (ctx, state) => const SafetyPage(),
      ),
      GoRoute(
        path: '/safety/add-contact',
        builder: (ctx, state) => const SafetyPage(),
      ),
      GoRoute(
        path: '/safety/report-incident',
        builder: (ctx, state) => const SafetyPage(),
      ),
      // Support
      GoRoute(path: '/support', builder: (ctx, state) => const SupportPage()),
      // Settings
      GoRoute(path: '/settings', builder: (ctx, state) => const ProfilePage()),
      // Scan (QR/Barcode)
      GoRoute(
        path: '/scan',
        builder: (ctx, state) => const OrderDiscoveryPage(),
      ),
    ],
  );
});
