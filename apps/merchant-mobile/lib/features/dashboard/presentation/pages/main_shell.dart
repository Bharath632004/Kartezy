import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Navigation destination configuration for the bottom nav bar.
class NavDestination {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String route;

  const NavDestination({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.route,
  });
}

const List<NavDestination> _destinations = [
  NavDestination(
    label: 'Dashboard',
    icon: Icons.dashboard_outlined,
    activeIcon: Icons.dashboard,
    route: '/dashboard',
  ),
  NavDestination(
    label: 'Orders',
    icon: Icons.receipt_long_outlined,
    activeIcon: Icons.receipt_long,
    route: '/orders',
  ),
  NavDestination(
    label: 'Products',
    icon: Icons.inventory_2_outlined,
    activeIcon: Icons.inventory_2,
    route: '/products',
  ),
  NavDestination(
    label: 'Finance',
    icon: Icons.account_balance_wallet_outlined,
    activeIcon: Icons.account_balance_wallet,
    route: '/finance',
  ),
  NavDestination(
    label: 'Profile',
    icon: Icons.person_outline,
    activeIcon: Icons.person,
    route: '/profile',
  ),
];

/// Main shell widget that wraps the app with a bottom navigation bar.
class MainShell extends ConsumerWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final location = GoRouterState.of(context).uri.toString();

    // Determine the current tab index from the route location.
    int currentIndex = 0;
    for (int i = 0; i < _destinations.length; i++) {
      if (location.startsWith(_destinations[i].route)) {
        currentIndex = i;
        break;
      }
    }

    return Scaffold(
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        child: child,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (index) {
          final destination = _destinations[index];
          context.go(destination.route);
        },
        backgroundColor: theme.colorScheme.surface,
        indicatorColor: theme.colorScheme.primaryContainer,
        elevation: 3,
        animationDuration: const Duration(milliseconds: 300),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: _destinations.map((d) {
          final isSelected = _destinations.indexOf(d) == currentIndex;
          return NavigationDestination(
            icon: AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isSelected ? d.activeIcon : d.icon,
                key: ValueKey('${d.label}_$isSelected'),
                color: isSelected
                    ? theme.colorScheme.primary
                    : theme.colorScheme.onSurfaceVariant,
              ),
            ),
            selectedIcon: Icon(d.activeIcon, color: theme.colorScheme.primary),
            label: d.label,
            tooltip: d.label,
          );
        }).toList(),
      ),
    );
  }
}
