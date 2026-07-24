import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/splash/pages/splash_screen.dart';
import 'package:customer_mobile/features/authentication/presentation/login_page.dart';
import 'package:customer_mobile/features/mfa/presentation/mfa_verification_page.dart';
import 'package:customer_mobile/features/mfa/presentation/mfa_enrollment_page.dart';
import 'package:customer_mobile/features/home/home_page.dart';
import 'package:customer_mobile/features/onboarding/onboarding_page.dart';
import 'package:customer_mobile/features/authentication/presentation/phone_login_page.dart';
import 'package:customer_mobile/features/authentication/presentation/otp_verification_page.dart';
import 'package:customer_mobile/features/profile/presentation/profile_page.dart';
import 'package:customer_mobile/features/referral/presentation/referral_page.dart';
import 'package:customer_mobile/features/search/presentation/search_home_page.dart';
import 'package:customer_mobile/features/search/presentation/search_results_page.dart';
import 'package:customer_mobile/features/search/presentation/product_details_page.dart';
import 'package:customer_mobile/features/order/presentation/pages/order_history_page.dart';
import 'package:customer_mobile/features/order/presentation/pages/order_detail_page.dart';
import 'package:customer_mobile/core/services/auth_service.dart';
import 'package:customer_mobile/features/cart/presentation/cart_page.dart';
import 'package:customer_mobile/features/checkout/presentation/checkout_page.dart';
import 'package:customer_mobile/features/wallet/presentation/wallet_page.dart';
import 'package:customer_mobile/features/membership/presentation/membership_page.dart';
import 'package:customer_mobile/features/support/presentation/support_page.dart';
import 'package:customer_mobile/features/notifications/presentation/notifications_page.dart';
import 'package:customer_mobile/features/rewards/presentation/rewards_page.dart';
import 'package:customer_mobile/features/wishlist/presentation/wishlist_page.dart';
import 'package:customer_mobile/features/tracking/presentation/pages/tracking_page.dart';
import 'package:customer_mobile/features/categories/presentation/categories_page.dart';
import 'package:customer_mobile/features/reviews/presentation/reviews_page.dart';

/// List of public route prefixes that don't require authentication
const Set<String> _publicRoutePrefixes = {
  '/splash',
  '/onboarding',
  '/login',
  '/phone-login',
  '/otp-verification',
  '/mfa-verify',
  '/mfa-enroll',
};

/// A ChangeNotifier that the GoRouter can listen to for refreshing redirects
/// when auth state changes.
class GoRouterRefreshNotifier extends ChangeNotifier {
  void notify() {
    notifyListeners();
  }
}

final goRouterRefreshNotifierProvider = Provider<GoRouterRefreshNotifier>((
  ref,
) {
  return GoRouterRefreshNotifier();
});

final goRouterProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = ref.watch(goRouterRefreshNotifierProvider);

  // Listen for auth state changes and trigger a router refresh
  ref.listen(authStateProvider, (previous, next) {
    refreshNotifier.notify();
  });

  return GoRouter(
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final authState = ref.read(authStateProvider);
      final isInitializing = ref
          .read(initializeAuthProvider)
          .maybeWhen(
            loading: () => true,
            error: (Object error, StackTrace stackTrace) => false,
            data: (data) => data,
            orElse: () => false,
          );

      if (isInitializing) {
        return '/splash';
      }

      final loggedIn = authState;
      final currentPath = state.uri.path;
      final isPublicRoute = _publicRoutePrefixes.any(
        (r) => currentPath == r || currentPath.startsWith('$r/'),
      );

      // If not logged in and trying to access a protected route, redirect to login
      if (!loggedIn && !isPublicRoute) {
        return '/login';
      }
      // If logged in and trying to access login page, redirect to home
      if (loggedIn &&
          (currentPath == '/login' ||
              currentPath == '/sign-up' ||
              currentPath == '/onboarding')) {
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
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(
        path: '/search',
        builder: (context, state) => const SearchHomePage(),
        routes: [
          GoRoute(
            path: 'results',
            builder: (context, state) {
              final query = state.uri.queryParameters['q'] ?? '';
              return SearchResultsPage(query: query);
            },
          ),
          GoRoute(
            path: 'product/:id',
            builder: (context, state) {
              final productId = state.pathParameters['id'] ?? '';
              return ProductDetailsPage(productId: productId);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/referral',
        builder: (context, state) => const ReferralPage(),
      ),
      GoRoute(
        path: '/orders',
        builder: (context, state) => const OrderHistoryPage(),
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final orderId = state.pathParameters['id'] ?? '';
              return OrderDetailPage(orderId: orderId);
            },
          ),
        ],
      ),
      GoRoute(path: '/cart', builder: (context, state) => const CartPage()),
      GoRoute(
        path: '/checkout',
        builder: (context, state) => const CheckoutPage(),
      ),
      GoRoute(path: '/wallet', builder: (context, state) => const WalletPage()),
      GoRoute(
        path: '/membership',
        builder: (context, state) => const MembershipPage(),
      ),
      GoRoute(
        path: '/support',
        builder: (context, state) => const SupportPage(),
        routes: [
          GoRoute(
            path: 'ticket/:id',
            builder: (context, state) {
              final ticketId = state.pathParameters['id'] ?? '';
              return SupportPage(ticketId: ticketId);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsPage(),
      ),
      GoRoute(
        path: '/rewards',
        builder: (context, state) => const RewardsPage(),
      ),
      GoRoute(
        path: '/wishlist',
        builder: (context, state) => const WishlistPage(),
      ),
      GoRoute(
        path: '/tracking/:orderId',
        builder: (context, state) {
          final orderId = state.pathParameters['orderId'] ?? '';
          return TrackingPage(orderId: orderId);
        },
      ),
      GoRoute(
        path: '/categories',
        builder: (context, state) => const CategoriesPage(),
        routes: [
          GoRoute(
            path: ':categoryId',
            builder: (context, state) {
              final categoryId = state.pathParameters['categoryId'] ?? '';
              return CategoriesPage(categoryId: categoryId);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/reviews/:productId',
        builder: (context, state) {
          final productId = state.pathParameters['productId'] ?? '';
          return ReviewsPage(productId: productId);
        },
      ),
    ],
  );
});
