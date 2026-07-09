import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/login_page.dart';
import 'package:merchant_mobile/features/auth/presentation/pages/register_page.dart';
import 'package:merchant_mobile/features/dashboard/presentation/pages/dashboard_page.dart';
import 'package:merchant_mobile/features/merchant_registration/presentation/pages/merchant_registration_page.dart';
import 'package:merchant_mobile/features/profile/presentation/pages/profile_page.dart';
import 'package:merchant_mobile/features/promotions/presentation/pages/promotions_page.dart';
import 'package:merchant_mobile/features/finance/presentation/pages/finance_dashboard_page.dart';
import 'package:merchant_mobile/features/analytics/presentation/pages/analytics_dashboard_page.dart';
import 'package:merchant_mobile/features/reports/presentation/pages/reports_page.dart';
import 'package:merchant_mobile/features/marketing/presentation/pages/marketing_dashboard_page.dart';
import 'package:merchant_mobile/features/invoices/presentation/pages/invoices_page.dart';

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
  ],
);