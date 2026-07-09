import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/register_page.dart';
import 'package:merchant_mobile/features/dashboard/presentation/pages/dashboard_page.dart';
import 'package:merchant_mobile/features/merchant_registration/presentation/pages/merchant_registration_page.dart';
import 'package:merchant_mobile/features/profile/presentation/pages/profile_page.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
    ),
    GoRoute(
      path: '/merchant-register',
      builder: (context, state) => const MerchantRegistrationPage(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
  ],
);