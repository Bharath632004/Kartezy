import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/onboarding_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:merchant_mobile/features/mfa/presentation/mfa_verification_page.dart';
import 'package:merchant_mobile/features/mfa/presentation/mfa_enrollment_page.dart';
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
import 'package:merchant_mobile/features/invoices/presentation/pages/invoices_list_page.dart';
import 'package:merchant_mobile/features/merchant_registration/presentation/pages/merchant_registration_page.dart';
import 'package:merchant_mobile/features/products/presentation/pages/product_list_page.dart';
import 'package:merchant_mobile/features/products/presentation/pages/add_product_page.dart';
import 'package:merchant_mobile/features/products/presentation/pages/edit_product_page.dart';
import 'package:merchant_mobile/features/products/presentation/pages/product_detail_page.dart';
import 'package:merchant_mobile/features/inventory/presentation/pages/inventory_list_page.dart';
import 'package:merchant_mobile/features/inventory/presentation/pages/add_inventory_page.dart';
import 'package:merchant_mobile/features/inventory/presentation/pages/edit_inventory_page.dart';
import 'package:merchant_mobile/features/orders/presentation/pages/order_list_page.dart';
import 'package:merchant_mobile/features/profile/presentation/pages/settings_page.dart';
import 'package:merchant_mobile/features/profile/presentation/pages/support_page.dart';
import 'package:merchant_mobile/features/notifications/presentation/pages/notifications_page.dart';
import 'package:merchant_mobile/features/customers/presentation/pages/customers_page.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';
import 'package:merchant_mobile/features/dashboard/presentation/pages/main_shell.dart';

/// A ChangeNotifier that triggers GoRouter redirect re-evaluation.
class GoRouterRefreshNotifier extends ChangeNotifier {
  void notify() => notifyListeners();
}

final goRouterRefreshNotifierProvider = Provider<GoRouterRefreshNotifier>((
  ref,
) {
  return GoRouterRefreshNotifier();
});

final goRouterProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = ref.watch(goRouterRefreshNotifierProvider);

  // Listen for auth state changes and trigger router refresh
  ref.listen(authStateProvider, (previous, next) {
    refreshNotifier.notify();
  });

  return GoRouter(
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final loggingIn = state.uri.path == '/login';
      final signingUp = state.uri.path == '/register';
      final verifyingOtp = state.uri.path == '/otp-verification';
      final mfaVerify = state.uri.path == '/mfa-verify';
      final mfaEnroll = state.uri.path == '/mfa-enroll';
      final phoneLogin = state.uri.path == '/phone-login';
      final onboarding = state.uri.path == '/onboarding';
      final splash = state.uri.path == '/splash';
      final isAuthRoute =
          loggingIn ||
          signingUp ||
          verifyingOtp ||
          mfaVerify ||
          mfaEnroll ||
          phoneLogin ||
          onboarding ||
          splash;

      final isInitializing = ref
          .read(isInitializedProvider)
          .maybeWhen(
            loading: () => true,
            error: (_, _) => false,
            data: (_) => false,
            orElse: () => false,
          );

      if (isInitializing) {
        return '/splash';
      }

      final loggedIn = ref.read(authStateProvider).isLoggedIn;

      // If not logged in and not on an auth route, redirect to login
      if (!loggedIn && !isAuthRoute) {
        return '/login';
      }

      // If logged in and on an auth route, redirect to dashboard
      if (loggedIn && isAuthRoute) {
        return '/dashboard';
      }

      return null;
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
      // Main app routes wrapped in ShellRoute for bottom navigation
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardPage(),
          ),
          GoRoute(
            path: '/orders',
            builder: (context, state) => const OrderListPage(),
          ),
          GoRoute(
            path: '/products',
            builder: (context, state) => const ProductListPage(),
          ),
          GoRoute(
            path: '/finance',
            builder: (context, state) => const FinanceDashboardPage(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfilePage(),
          ),
        ],
      ),
      GoRoute(
        path: '/promotions',
        builder: (context, state) => const PromotionsPage(),
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
        builder: (context, state) => const InvoicesListPage(),
      ),
      GoRoute(
        path: '/merchant-register',
        builder: (context, state) => const MerchantRegistrationPage(),
      ),
      GoRoute(
        path: '/add-product',
        builder: (context, state) => const AddProductPage(),
      ),
      GoRoute(
        path: '/edit-product',
        builder: (context, state) => const EditProductPage(),
      ),
      GoRoute(
        path: '/product-detail',
        builder: (context, state) => const ProductDetailPage(),
      ),
      GoRoute(
        path: '/inventory',
        builder: (context, state) => const InventoryListPage(),
      ),
      GoRoute(
        path: '/add-inventory',
        builder: (context, state) => const AddInventoryPage(),
      ),
      GoRoute(
        path: '/edit-inventory',
        builder: (context, state) => const EditInventoryPage(),
      ),
      GoRoute(
        path: '/inventory-detail',
        builder: (context, state) => const EditInventoryPage(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsPage(),
      ),
      GoRoute(
        path: '/support',
        builder: (context, state) => const SupportPage(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsPage(),
      ),
      GoRoute(
        path: '/customers',
        builder: (context, state) => const CustomersPage(),
      ),
    ],
  );
});

// Provider to check if app initialization is complete
final isInitializedProvider = FutureProvider<bool>((ref) async {
  final authService = ref.read(authServiceProvider);
  final isLoggedIn = await authService.isLoggedIn();
  return isLoggedIn;
});
