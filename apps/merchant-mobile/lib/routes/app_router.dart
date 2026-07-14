import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/onboarding_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/register_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/splash_screen.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/phone_login_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/otp_verification_page.dart';
import 'package:merchant_mobile/features/dashboard/presentation/pages/dashboard_page.dart';
import 'package:merchant_mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:merchant_mobile/features/promotions/presentation/pages/promotions_page.dart';
import 'package:merchant_mobile/features/finance/presentation/pages/finance_dashboard_page.dart';
import 'package:merchant_mobile/features/analytics/presentation/pages/analytics_dashboard_page.dart';
import 'package:merchant_mobile/features/reports/presentation/pages/reports_page.dart';
import 'package:merchant_mobile/features/marketing/presentation/pages/marketing_dashboard_page.dart';
import 'package:merchant_mobile/features/invoices/presentation/pages/invoices_page.dart';
import 'package:merchant_mobile/features/merchant_registration/presentation/pages/merchant_registration_page.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authService = ref.read(authServiceProvider);
  return GoRouter(
    refreshListenable: Listenable.merge([
      ref.read(authStateProvider.notifier),
      ref.read(isInitializedProvider.future),
    ]),
    redirect: (context, state) {
      final loggingIn = state.uri.path == '/login';
      final signingUp = state.uri.path == '/register';
      final verifyingOtp = state.uri.path == '/otp-verification';
      final phoneLogin = state.uri.path == '/phone-login';
      final resetPassword = state.uri.path == '/reset-password';
      final verifyingOtpReset = state.uri.path == '/verify-otp-reset';
      final onboarding = state.uri.path == '/onboarding';
      final splash = state.uri.path == '/splash';

      final isInitializing = ref
          .watch(isInitializedProvider)
          .maybeWhen(
            loading: () => true,
            error: () => false,
            data: (_) => false,
            orElse: () => false,
          );

      if (isInitializing) {
        return '/splash';
      }

      final loggedIn = ref.watch(authStateProvider);
      final hasSeenOnboarding = ref.watch(
        hiveManagerProvider.select((value) => value.hasSeenOnboarding),
      );

      // If not logged in and not onboarding/splash/login/register/etc, go to login
      if (!loggedIn &&
          !onboarding &&
          !splash &&
          !loggingIn &&
          !signingUp &&
          !verifyingOtp &&
          !phoneLogin &&
          !resetPassword &&
          !verifyingOtpReset) {
        return '/login';
      }

      // If logged in and trying to access onboarding, login, register, go to dashboard
      if (loggedIn &&
          (onboarding ||
              loggingIn ||
              signingUp ||
              verifyingOtp ||
              phoneLogin ||
              resetPassword ||
              verifyingOtpReset)) {
        return '/dashboard';
      }

      // If not logged in and trying to access dashboard, go to login
      if (!loggedIn && state.uri.path.startsWith('/dashboard')) {
        return '/login';
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
        path: '/register',
        builder: (context, state) => const RegisterPage(),
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
        path: '/dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/promotions',
        builder: (context, state) => const PromotionsPage(),
      ),
      GoRoute(
        path: '/finance',
        builder: (context, state) => const FinanceDashboardPage(),
      ),
      GoRoute(
        path: '/analytics',
        builder: (context, state) => const AnalyticsDashboardPage(),
      ),
      GoRoute(
        path: '/reports',
        builder: (context, state) => const ReportsPage(),
      ),
      GoRoute(
        path: '/marketing',
        builder: (context, state) => const MarketingDashboardPage(),
      ),
      GoRoute(
        path: '/invoices',
        builder: (context, state) => const InvoicesPage(),
      ),
      GoRoute(
        path: '/merchant-register',
        builder: (context, state) => const MerchantRegistrationPage(),
      ),
    ],
  );
});

// Provider to check if app initialization is complete
final isInitializedProvider = FutureProvider<bool>((ref) async {
  // Wait for Firebase, Hive, etc. to initialize
  // We'll do a simple delay for now, but in reality you'd wait for futures
  await Future.delayed(const Duration(seconds: 1));
  return true;
});

// Helper extension to check if user has seen onboarding
extension HiveManagerExtension on AsyncValue<HiveManager> {
  bool get hasSeenOnboarding {
    return whenData(
      (manager) => manager.hasSeenOnboarding(),
      orElse: () => false,
    );
  }
}
