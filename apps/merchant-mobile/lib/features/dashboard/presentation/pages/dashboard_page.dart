import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/dashboard/providers.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardState = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Merchant Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx, false),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(ctx, true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                      ),
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
              if (confirm == true) {
                await ref.read(authServiceProvider).logout();
                if (context.mounted) {
                  context.go('/login');
                }
              }
            },
          ),
        ],
      ),
      body: dashboardState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : dashboardState.error != null
          ? Center(
              child: Text(
                'Error: ${dashboardState.error}',
                style: const TextStyle(color: Colors.red),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Today's Overview
                  _buildOverviewCard(
                    context: context,
                    title: 'Today Overview',
                    children: [
                      _buildStatItem(
                        label: 'Sales',
                        value:
                            '₹${dashboardState.todaySales.toStringAsFixed(2)}',
                        icon: Icons.sell,
                      ),
                      _buildStatItem(
                        label: 'Orders',
                        value: '${dashboardState.orders}',
                        icon: Icons.shopping_cart,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Order Status
                  _buildOrderStatusCard(
                    context: context,
                    pending: dashboardState.pendingOrders,
                    cancelled: dashboardState.cancelledOrders,
                  ),
                  const SizedBox(height: 16),
                  // Visitors and Rating
                  _buildStatsCard(
                    context: context,
                    title: 'Visitors & Rating',
                    children: [
                      _buildStatItem(
                        label: 'Visitors',
                        value: '${dashboardState.visitors}',
                        icon: Icons.person,
                      ),
                      _buildStatItem(
                        label: 'Rating',
                        value: dashboardState.rating.toStringAsFixed(1),
                        icon: Icons.star,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Revenue and Earnings
                  _buildStatsCard(
                    context: context,
                    title: 'Revenue & Earnings',
                    children: [
                      _buildStatItem(
                        label: 'Revenue',
                        value: '₹${dashboardState.revenue.toStringAsFixed(2)}',
                        icon: Icons.attach_money,
                      ),
                      _buildStatItem(
                        label: 'Average Order Value',
                        value: dashboardState.orders > 0
                            ? '₹${(dashboardState.revenue / dashboardState.orders).toStringAsFixed(2)}'
                            : '₹0.00',
                        icon: Icons.attach_money,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Featured Features
                  _buildFeaturesCard(context: context),
                ],
              ),
            ),
    );
  }

  Widget _buildOverviewCard({
    required BuildContext context,
    required String title,
    required List<Widget> children,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: children,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem({
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Column(
      children: [
        Icon(icon, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        Text(label, style: TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildOrderStatusCard({
    required BuildContext context,
    required int pending,
    required int cancelled,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Order Status',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatusItem(
                  label: 'Pending',
                  value: pending.toString(),
                  color: Colors.orange,
                ),
                _buildStatusItem(
                  label: 'Cancelled',
                  value: cancelled.toString(),
                  color: Colors.red,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusItem({
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(label, style: TextStyle(color: color, fontSize: 12)),
      ],
    );
  }

  Widget _buildStatsCard({
    required BuildContext context,
    required String title,
    required List<Widget> children,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: children,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturesCard({required BuildContext context}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quick Access',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 3,
              childAspectRatio: 1.2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildFeatureItem(
                  context: context,
                  icon: Icons.local_offer,
                  label: 'Promotions',
                  onTap: () {
                    context.go('/promotions');
                  },
                ),
                _buildFeatureItem(
                  context: context,
                  icon: Icons.account_balance_wallet,
                  label: 'Finance',
                  onTap: () {
                    context.go('/finance');
                  },
                ),
                _buildFeatureItem(
                  context: context,
                  icon: Icons.analytics,
                  label: 'Analytics',
                  onTap: () {
                    context.go('/analytics');
                  },
                ),
                _buildFeatureItem(
                  context: context,
                  icon: Icons.description,
                  label: 'Reports',
                  onTap: () {
                    context.go('/reports');
                  },
                ),
                _buildFeatureItem(
                  context: context,
                  icon: Icons.campaign,
                  label: 'Marketing',
                  onTap: () {
                    context.go('/marketing');
                  },
                ),
                _buildFeatureItem(
                  context: context,
                  icon: Icons.receipt_long,
                  label: 'Invoices',
                  onTap: () {
                    context.go('/invoices');
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureItem({
    required BuildContext context,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 28, color: Theme.of(context).primaryColor),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
