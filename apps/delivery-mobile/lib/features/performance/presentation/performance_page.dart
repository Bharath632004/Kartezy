import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Performance dashboard for delivery partners.
class PerformancePage extends ConsumerWidget {
  const PerformancePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      appBar: AppBar(
        title: const Text('Performance'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (v) {},
            itemBuilder: (ctx) => [
              const PopupMenuItem(value: 'week', child: Text('This Week')),
              const PopupMenuItem(value: 'month', child: Text('This Month')),
              const PopupMenuItem(value: 'all', child: Text('All Time')),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Performance Score
            _buildPerformanceScore(theme),
            const SizedBox(height: 16),
            // Key Metrics
            _buildKeyMetrics(theme),
            const SizedBox(height: 16),
            // Ratings
            _buildRatingsSection(theme),
            const SizedBox(height: 16),
            // Delivery Stats
            _buildDeliveryStats(theme),
            const SizedBox(height: 16),
            // Leaderboard
            _buildLeaderboard(theme),
            const SizedBox(height: 16),
            // Badges
            _buildBadges(theme),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  Widget _buildPerformanceScore(ThemeData theme) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text(
              'Overall Performance',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: 120,
              height: 120,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 120,
                    height: 120,
                    child: CircularProgressIndicator(
                      value: 0.87,
                      strokeWidth: 10,
                      backgroundColor: Colors.grey[200],
                      color: Colors.green,
                      strokeCap: StrokeCap.round,
                    ),
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        '87',
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        '/ 100',
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.green.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.trending_up, size: 16, color: Colors.green),
                  SizedBox(width: 4),
                  Text(
                    '+5 from last week',
                    style: TextStyle(
                      color: Colors.green,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKeyMetrics(ThemeData theme) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.3,
      children: [
        _MetricCard(
          label: 'Acceptance Rate',
          value: '97%',
          icon: Icons.check_circle,
          color: Colors.green,
          progress: 0.97,
        ),
        _MetricCard(
          label: 'On-Time Delivery',
          value: '94%',
          icon: Icons.timer,
          color: Colors.blue,
          progress: 0.94,
        ),
        _MetricCard(
          label: 'Completion Rate',
          value: '98%',
          icon: Icons.verified,
          color: Colors.purple,
          progress: 0.98,
        ),
        _MetricCard(
          label: 'Avg Delivery Time',
          value: '18 min',
          icon: Icons.speed,
          color: Colors.orange,
          progress: 0.75,
        ),
      ],
    );
  }

  Widget _buildRatingsSection(ThemeData theme) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Ratings',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                // Customer Rating
                Expanded(
                  child: Column(
                    children: [
                      const Icon(
                        Icons.star_rounded,
                        color: Colors.amber,
                        size: 32,
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        '4.8',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                        ),
                      ),
                      const Text(
                        'Customer',
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Container(width: 1, height: 60, color: Colors.grey[200]),
                // Merchant Rating
                Expanded(
                  child: Column(
                    children: [
                      const Icon(Icons.store, color: Colors.blue, size: 32),
                      const SizedBox(height: 4),
                      const Text(
                        '4.7',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                        ),
                      ),
                      const Text(
                        'Merchant',
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Rating breakdown
            _RatingBar(stars: 5, count: 89, total: 100),
            _RatingBar(stars: 4, count: 8, total: 100),
            _RatingBar(stars: 3, count: 2, total: 100),
            _RatingBar(stars: 2, count: 1, total: 100),
            _RatingBar(stars: 1, count: 0, total: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryStats(ThemeData theme) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Delivery Statistics',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 16),
            _StatRow(label: 'Total Orders Assigned', value: '1,270'),
            _StatRow(label: 'Orders Delivered', value: '1,234'),
            _StatRow(label: 'Orders Cancelled', value: '36'),
            _StatRow(label: 'Total Distance', value: '3,456 km'),
            _StatRow(label: 'Total Hours Online', value: '456 hrs'),
            _StatRow(label: 'Cancellation Rate', value: '2.8%'),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboard(ThemeData theme) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Leaderboard',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                TextButton(onPressed: () {}, child: const Text('This Week')),
              ],
            ),
            const SizedBox(height: 12),
            _LeaderboardTile(
              rank: 1,
              name: 'Rahul S.',
              deliveries: 156,
              rating: 4.9,
              medal: '🥇',
            ),
            _LeaderboardTile(
              rank: 2,
              name: 'Priya M.',
              deliveries: 148,
              rating: 4.8,
              medal: '🥈',
            ),
            _LeaderboardTile(
              rank: 3,
              name: 'You',
              deliveries: 142,
              rating: 4.8,
              medal: '🥉',
              isYou: true,
            ),
            _LeaderboardTile(
              rank: 4,
              name: 'Vikram R.',
              deliveries: 135,
              rating: 4.7,
            ),
            _LeaderboardTile(
              rank: 5,
              name: 'Anita K.',
              deliveries: 128,
              rating: 4.6,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadges(ThemeData theme) {
    final badges = [
      {
        'icon': Icons.local_fire_department,
        'label': 'Hot Streak',
        'color': Colors.orange,
      },
      {'icon': Icons.speed, 'label': 'Speed Demon', 'color': Colors.blue},
      {'icon': Icons.star, 'label': 'Top Rated', 'color': Colors.amber},
      {'icon': Icons.emoji_events, 'label': '1K Club', 'color': Colors.green},
      {'icon': Icons.nightlife, 'label': 'Night Owl', 'color': Colors.purple},
      {'icon': Icons.bolt, 'label': 'Quick Learner', 'color': Colors.teal},
    ];

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Badges Earned',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 16,
              runSpacing: 16,
              children: badges
                  .map(
                    (b) => Column(
                      children: [
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: (b['color'] as Color).withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            b['icon'] as IconData,
                            color: b['color'] as Color,
                            size: 30,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          b['label'] as String,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  )
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final double progress;
  const _MetricCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color, size: 18),
                ),
                const Spacer(),
                Text(
                  value,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: color,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Text(
              label,
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.grey[200],
              color: color,
              borderRadius: BorderRadius.circular(4),
              minHeight: 4,
            ),
          ],
        ),
      ),
    );
  }
}

class _RatingBar extends StatelessWidget {
  final int stars;
  final int count;
  final int total;
  const _RatingBar({
    required this.stars,
    required this.count,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          SizedBox(
            width: 20,
            child: Text('$stars', style: const TextStyle(fontSize: 12)),
          ),
          const Icon(Icons.star, size: 14, color: Colors.amber),
          const SizedBox(width: 8),
          Expanded(
            child: LinearProgressIndicator(
              value: count / total,
              backgroundColor: Colors.grey[200],
              color: Colors.amber,
              borderRadius: BorderRadius.circular(4),
              minHeight: 6,
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 20,
            child: Text(
              '$count',
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label;
  final String value;
  const _StatRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 14)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ],
      ),
    );
  }
}

class _LeaderboardTile extends StatelessWidget {
  final int rank;
  final String name;
  final int deliveries;
  final double rating;
  final String? medal;
  final bool isYou;
  const _LeaderboardTile({
    required this.rank,
    required this.name,
    required this.deliveries,
    required this.rating,
    this.medal,
    this.isYou = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isYou
            ? theme.colorScheme.primaryContainer.withValues(alpha: 0.3)
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
              medal ?? '$rank',
              style: TextStyle(
                fontSize: medal != null ? 18 : 14,
                fontWeight: FontWeight.bold,
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
                fontSize: 12,
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
                    fontSize: 14,
                  ),
                ),
                Text(
                  '$deliveries deliveries',
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
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
