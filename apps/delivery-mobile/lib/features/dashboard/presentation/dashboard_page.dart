// lib/features/dashboard/presentation/dashboard_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/dashboard/provider/provider.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardState = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(dashboardProvider.notifier).refresh();
            },
          ),
        ],
      ),
      body: () {
        if (dashboardState.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (dashboardState.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Error: ${dashboardState.error}'),
                ElevatedButton(
                  onPressed: () {
                    ref.read(dashboardProvider.notifier).refresh();
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }
        final data = dashboardState.data;
        if (data == null) {
          return const Center(child: Text('No data available'));
        }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Online/Offline Toggle
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Online Status',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Switch(
                      value: data['isOnline'] ?? false,
                      onChanged: (value) {
                        ref.read(dashboardProvider.notifier).toggleOnline(value);
                      },
                    ),
                  ],
                ),
                const Divider(),
                // Earnings Section
                const Text(
                  'Earnings',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildEarningCard(
                      'Today',
                      '₹${data['todayEarnings']?.toStringAsFixed(2) ?? '0.00'}',
                    ),
                    _buildEarningCard(
                      'Weekly',
                      '₹${data['weeklyEarnings']?.toStringAsFixed(2) ?? '0.00'}',
                    ),
                    _buildEarningCard(
                      'Monthly',
                      '₹${data['monthlyEarnings']?.toStringAsFixed(2) ?? '0.00'}',
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Orders Section
                const Text(
                  'Orders',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildOrderCard(
                      'Available',
                      '${data['availableOrders'] ?? 0}',
                    ),
                    _buildOrderCard(
                      'Accepted',
                      '${data['acceptedOrders'] ?? 0}',
                    ),
                    _buildOrderCard(
                      'Delivered',
                      '${data['deliveredOrders'] ?? 0}',
                    ),
                    _buildOrderCard(
                      'Cancelled',
                      '${data['cancelledOrders'] ?? 0}',
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Ratings and Wallet
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildMetricCard(
                      'Rating',
                      '${data['rating'] ?? 0.0}/5.0',
                      Icons.star,
                    ),
                    _buildMetricCard(
                      'Wallet',
                      '₹${data['walletBalance'] ?? 0.00}',
                      Icons.account_balance_wallet,
                    ),
                    _buildMetricCard(
                      'Distance',
                      '${data['totalDistance'] ?? 0} km',
                      Icons.directions_car,
                    ),
                    _buildMetricCard(
                      'Avg Time',
                      '${data['avgDeliveryTime'] ?? 0} mins',
                      Icons.timer,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Acceptance Rate
                _buildMetricCard(
                  'Acceptance Rate',
                  '${data['acceptanceRate'] ?? 0}%',
                  Icons.thumb_up,
                ),
              ],
            ),
          );
      }(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              break;
            case 1:
              context.go('/home/orders');
              break;
            case 2:
              // Wallet - could navigate to earnings page
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Wallet coming soon')),
              );
              break;
            case 3:
              context.go('/profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'Orders'),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Wallet',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildEarningCard(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 14)),
        Text(
          value,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildOrderCard(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 14)),
        Text(
          value,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 24),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12)),
        Text(
          value,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
