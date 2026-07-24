import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/dashboard/presentation/online_status_card.dart';

/// World-class delivery partner dashboard.
class DashboardPage extends ConsumerStatefulWidget {
  const DashboardPage({super.key});

  @override
  ConsumerState<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends ConsumerState<DashboardPage>
    with SingleTickerProviderStateMixin {
  bool _isOnline = false;
  bool _isOnBreak = false;
  DateTime? _shiftStart;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final shiftDuration = _shiftStart != null
        ? DateTime.now().difference(_shiftStart!)
        : null;

    return Scaffold(
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {},
          child: CustomScrollView(
            slivers: [
              // App Bar
              SliverToBoxAdapter(child: _buildAppBar(theme)),
              // Online Status Card
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: OnlineStatusCard(
                    isOnline: _isOnline,
                    isOnBreak: _isOnBreak,
                    shiftDuration: shiftDuration,
                    ordersInShift: 5,
                    onToggleOnline: () {
                      setState(() {
                        _isOnline = !_isOnline;
                        if (_isOnline) {
                          _shiftStart = DateTime.now();
                        } else {
                          _shiftStart = null;
                          _isOnBreak = false;
                        }
                      });
                    },
                    onToggleBreak: () {
                      setState(() => _isOnBreak = !_isOnBreak);
                    },
                    onStartShift: () {
                      setState(() {
                        _isOnline = true;
                        _shiftStart = DateTime.now();
                      });
                    },
                    onEndShift: () {
                      setState(() {
                        _isOnline = false;
                        _isOnBreak = false;
                        _shiftStart = null;
                      });
                    },
                  ),
                ),
              ),
              // Earnings Summary
              SliverToBoxAdapter(child: _buildEarningsSummary(theme)),
              // Performance Metrics
              SliverToBoxAdapter(child: _buildPerformanceMetrics(theme)),
              // Quick Actions
              SliverToBoxAdapter(child: _buildQuickActions(theme)),
              // Demand Heatmap Preview
              SliverToBoxAdapter(child: _buildDemandHeatmap(theme)),
              // Leaderboard Preview
              SliverToBoxAdapter(child: _buildLeaderboardPreview(theme)),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Hello, Partner! 👋',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                _isOnline ? 'Ready to deliver' : 'Currently offline',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
          Row(
            children: [
              if (_isOnline)
                ScaleTransition(
                  scale: _pulseAnimation,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.green,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green.withValues(alpha: 0.4),
                          blurRadius: 8,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () => context.push('/notifications'),
                icon: Stack(
                  children: [
                    const Icon(Icons.notifications_outlined, size: 28),
                    Positioned(
                      right: 2,
                      top: 2,
                      child: Container(
                        width: 16,
                        height: 16,
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Text(
                            '3',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEarningsSummary(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Today\'s Earnings',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.trending_up, size: 14, color: Colors.green),
                        SizedBox(width: 4),
                        Text(
                          '+12%',
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                '₹847',
                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _EarningChip(
                    label: 'Delivery',
                    amount: '₹620',
                    icon: Icons.delivery_dining,
                  ),
                  const SizedBox(width: 8),
                  _EarningChip(
                    label: 'Tips',
                    amount: '₹147',
                    icon: Icons.volunteer_activism,
                  ),
                  const SizedBox(width: 8),
                  _EarningChip(
                    label: 'Bonus',
                    amount: '₹80',
                    icon: Icons.emoji_events,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPerformanceMetrics(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Performance',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/performance'),
                    child: const Text('View All'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _MetricTile(
                      label: 'Rating',
                      value: '4.8',
                      icon: Icons.star_rounded,
                      color: Colors.amber,
                    ),
                  ),
                  Expanded(
                    child: _MetricTile(
                      label: 'On-Time',
                      value: '94%',
                      icon: Icons.timer_rounded,
                      color: Colors.green,
                    ),
                  ),
                  Expanded(
                    child: _MetricTile(
                      label: 'Acceptance',
                      value: '97%',
                      icon: Icons.check_circle_rounded,
                      color: Colors.blue,
                    ),
                  ),
                  Expanded(
                    child: _MetricTile(
                      label: 'Deliveries',
                      value: '1,234',
                      icon: Icons.inventory_2_rounded,
                      color: Colors.purple,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions(ThemeData theme) {
    final actions = [
      _QuickAction(
        icon: Icons.map_rounded,
        label: 'Navigate',
        color: Colors.blue,
        onTap: () => context.push('/navigation'),
      ),
      _QuickAction(
        icon: Icons.history_rounded,
        label: 'History',
        color: Colors.orange,
        onTap: () => context.go('/home/history'),
      ),
      _QuickAction(
        icon: Icons.shield_rounded,
        label: 'Safety',
        color: Colors.red,
        onTap: () => context.push('/safety'),
      ),
      _QuickAction(
        icon: Icons.support_agent_rounded,
        label: 'Support',
        color: Colors.teal,
        onTap: () => context.push('/support'),
      ),
      _QuickAction(
        icon: Icons.qr_code_scanner_rounded,
        label: 'Scan',
        color: Colors.purple,
        onTap: () => context.push('/scan'),
      ),
      _QuickAction(
        icon: Icons.settings_rounded,
        label: 'Settings',
        color: Colors.grey,
        onTap: () => context.push('/settings'),
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Quick Actions',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.2,
                ),
                itemCount: actions.length,
                itemBuilder: (context, index) => actions[index],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDemandHeatmap(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Demand Areas',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.orange.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      children: [
                        Icon(
                          Icons.local_fire_department,
                          size: 14,
                          color: Colors.orange,
                        ),
                        SizedBox(width: 4),
                        Text(
                          'High Demand',
                          style: TextStyle(
                            color: Colors.orange,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Mini heatmap visualization
              Container(
                height: 120,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Stack(
                  children: [
                    // Grid pattern
                    Center(
                      child: Wrap(
                        spacing: 4,
                        runSpacing: 4,
                        children: List.generate(30, (i) {
                          final intensity = (i % 7) / 6.0;
                          return Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: Color.lerp(
                                Colors.green.withValues(alpha: 0.2),
                                Colors.red.withValues(alpha: 0.8),
                                intensity,
                              ),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          );
                        }),
                      ),
                    ),
                    // Center marker
                    const Center(
                      child: Icon(
                        Icons.my_location,
                        color: Colors.blue,
                        size: 24,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _HeatmapArea(
                    name: 'MG Road',
                    demand: 'High',
                    color: Colors.red,
                  ),
                  _HeatmapArea(
                    name: 'Koramangala',
                    demand: 'Medium',
                    color: Colors.orange,
                  ),
                  _HeatmapArea(
                    name: 'HSR Layout',
                    demand: 'Low',
                    color: Colors.green,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLeaderboardPreview(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Leaderboard',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/leaderboard'),
                    child: const Text('See Full'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _LeaderboardRow(
                rank: 1,
                name: 'Rahul S.',
                deliveries: 156,
                rating: 4.9,
                isYou: false,
              ),
              _LeaderboardRow(
                rank: 2,
                name: 'Priya M.',
                deliveries: 148,
                rating: 4.8,
                isYou: false,
              ),
              _LeaderboardRow(
                rank: 3,
                name: 'You',
                deliveries: 142,
                rating: 4.8,
                isYou: true,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EarningChip extends StatelessWidget {
  final String label;
  final String amount;
  final IconData icon;
  const _EarningChip({
    required this.label,
    required this.amount,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  size: 14,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 4),
                Text(
                  label,
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              amount,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricTile extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _MetricTile({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}

class _HeatmapArea extends StatelessWidget {
  final String name;
  final String demand;
  final Color color;
  const _HeatmapArea({
    required this.name,
    required this.demand,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 4),
            Text(
              name,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        Text(demand, style: TextStyle(fontSize: 11, color: color)),
      ],
    );
  }
}

class _LeaderboardRow extends StatelessWidget {
  final int rank;
  final String name;
  final int deliveries;
  final double rating;
  final bool isYou;
  const _LeaderboardRow({
    required this.rank,
    required this.name,
    required this.deliveries,
    required this.rating,
    required this.isYou,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isYou
            ? theme.colorScheme.primaryContainer.withValues(alpha: 0.5)
            : null,
        borderRadius: BorderRadius.circular(12),
        border: isYou
            ? Border.all(
                color: theme.colorScheme.primary.withValues(alpha: 0.3),
              )
            : null,
      ),
      child: Row(
        children: [
          SizedBox(
            width: 28,
            child: Text(
              rank == 1
                  ? '🥇'
                  : rank == 2
                  ? '🥈'
                  : rank == 3
                  ? '🥉'
                  : '$rank',
              style: TextStyle(
                fontSize: rank <= 3 ? 18 : 14,
                fontWeight: FontWeight.bold,
                color: isYou ? theme.colorScheme.primary : null,
              ),
            ),
          ),
          const SizedBox(width: 8),
          CircleAvatar(
            radius: 16,
            backgroundColor: theme.colorScheme.primaryContainer,
            child: Text(
              name[0],
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: TextStyle(
                    fontWeight: isYou ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
                Text(
                  '$deliveries deliveries',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
          Row(
            children: [
              const Icon(Icons.star, size: 14, color: Colors.amber),
              const SizedBox(width: 2),
              Text(
                rating.toString(),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
