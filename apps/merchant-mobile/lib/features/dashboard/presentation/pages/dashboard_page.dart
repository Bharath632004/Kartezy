import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/features/promotions/presentation/pages/promotions_page.dart';
import 'package:merchant_mobile/features/finance/presentation/pages/finance_dashboard_page.dart';
import 'package:merchant_mobile/features/analytics/presentation/pages/analytics_dashboard_page.dart';
import 'package:merchant_mobile/features/reports/presentation/pages/reports_page.dart';
import 'package:merchant_mobile/features/marketing/presentation/pages/marketing_dashboard_page.dart';
import 'package:merchant_mobile/features/invoices/presentation/pages/invoices_page.dart';
import '../providers.dart';

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
            onPressed: () {
              // TODO: Implement logout
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
                        title: 'Today Overview',
                        children: [
                          _buildStatItem(
                            label: 'Sales',
                            value: '\$${dashboardState.todaySales.toStringAsFixed(2)}',
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
                        pending: dashboardState.pendingOrders,
                        cancelled: dashboardState.cancelledOrders,
                      ),
                      const SizedBox(height: 16),
                      // Visitors and Rating
                      _buildStatsCard(
                        title: 'Visitors & Rating',
                        children: [
                          _buildStatItem(
                            label: 'Visitors',
                            value: '${dashboardState.visitors}',
                            icon: Icons.person,
                          ),
                          _buildStatItem(
                            label: 'Rating',
                            value: '${dashboardState.rating.toStringAsFixed(1)}',
                            icon: Icons.star,
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Revenue and Earnings
                      _buildStatsCard(
                        title: 'Revenue & Earnings',
                        children: [
                          _buildStatItem(
                            label: 'Revenue',
                            value: '\$${dashboardState.revenue.toStringAsFixed(2)}',
                            icon: Icons.attach_money,
                          ),
                          _buildStatItem(
                            label: 'Average Order Value',
                            value: dashboardState.orders > 0
                                ? '\$${(dashboardState.revenue / dashboardState.orders).toStringAsFixed(2)}'
                                : '\$0.00',
                            icon: Icons.attach_money,
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Featured Features
                      _buildFeaturesCard(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildOverviewCard({required String title, required List<Widget> children}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
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

  Widget _buildStatItem({required String label, required String value, required IconData icon}) {
    return Column(
      children: [
        Icon(icon, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildOrderStatusCard({required int pending, required int cancelled}) {
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
                  value: '$pending',
                  color: Colors.orange,
                ),
                _buildStatusItem(
                  label: 'Cancelled',
                  value: '$cancelled',
                  color: Colors.red,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusItem({required String label, required String value, required Color color}) {
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
        Text(
          label,
          style: TextStyle(color: color, fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildStatsCard({required String title, required List<Widget> children}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
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
}