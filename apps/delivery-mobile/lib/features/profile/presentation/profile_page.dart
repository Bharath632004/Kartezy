import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:kartezy_core/services/auth_service.dart';

/// World-class delivery partner profile page.
class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Profile Header
              _buildProfileHeader(theme, context, ref),
              const SizedBox(height: 16),
              // Performance Score
              _buildPerformanceScore(theme),
              const SizedBox(height: 16),
              // Badges
              _buildBadges(theme),
              const SizedBox(height: 16),
              // Vehicle Info
              _buildVehicleInfo(theme),
              const SizedBox(height: 16),
              // Documents
              _buildDocuments(theme, context),
              const SizedBox(height: 16),
              // Settings & Account
              _buildSettingsSection(theme, context, ref),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader(
    ThemeData theme,
    BuildContext context,
    WidgetRef ref,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            theme.colorScheme.primaryContainer,
            theme.colorScheme.surface,
          ],
        ),
      ),
      child: Column(
        children: [
          // Profile Picture
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              CircleAvatar(
                radius: 50,
                backgroundColor: theme.colorScheme.primary.withValues(
                  alpha: 0.1,
                ),
                child: Icon(
                  Icons.person,
                  size: 50,
                  color: theme.colorScheme.primary,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.camera_alt,
                  size: 16,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Rajesh Kumar',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'DP-2024-1234',
            style: TextStyle(color: Colors.grey[600], fontSize: 13),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.verified, size: 14, color: Colors.green),
                    SizedBox(width: 4),
                    Text(
                      'KYC Verified',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.star, size: 14, color: Colors.amber),
                    SizedBox(width: 4),
                    Text(
                      '4.8 Rating',
                      style: TextStyle(
                        color: Colors.amber,
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
          // Quick stats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _ProfileStat(label: 'Deliveries', value: '1,234'),
              _ProfileStat(label: 'Rating', value: '4.8/5'),
              _ProfileStat(label: 'Months', value: '12'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceScore(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Performance Score',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  SizedBox(
                    width: 80,
                    height: 80,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CircularProgressIndicator(
                          value: 0.87,
                          strokeWidth: 8,
                          backgroundColor: Colors.grey[200],
                          color: Colors.green,
                        ),
                        const Text(
                          '87',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _ScoreBar(
                          label: 'On-Time',
                          value: 0.94,
                          color: Colors.green,
                        ),
                        const SizedBox(height: 8),
                        _ScoreBar(
                          label: 'Completion',
                          value: 0.98,
                          color: Colors.blue,
                        ),
                        const SizedBox(height: 8),
                        _ScoreBar(
                          label: 'Customer Rating',
                          value: 0.96,
                          color: Colors.amber,
                        ),
                      ],
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
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Badges',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: badges
                    .map(
                      (b) => Column(
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              color: (b['color'] as Color).withValues(
                                alpha: 0.1,
                              ),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              b['icon'] as IconData,
                              color: b['color'] as Color,
                              size: 28,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            b['label'] as String,
                            style: const TextStyle(fontSize: 11),
                          ),
                        ],
                      ),
                    )
                    .toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVehicleInfo(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Column(
          children: [
            ListTile(
              leading: const Icon(Icons.two_wheeler, color: Colors.blue),
              title: const Text(
                'Vehicle Information',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push('/profile/vehicle'),
            ),
            const Divider(height: 1),
            _buildInfoTile('Type', 'Motorcycle'),
            _buildInfoTile('Number', 'KA-01-AB-1234'),
            _buildInfoTile('Brand', 'Honda Activa 6G'),
            _buildInfoTile('Insurance', 'Valid until Dec 2026'),
          ],
        ),
      ),
    );
  }

  Widget _buildDocuments(ThemeData theme, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Column(
          children: [
            ListTile(
              leading: const Icon(Icons.description, color: Colors.purple),
              title: const Text(
                'Documents',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push('/profile/documents'),
            ),
            const Divider(height: 1),
            _buildDocTile('Driving License', 'Verified', Colors.green),
            _buildDocTile('Aadhaar Card', 'Verified', Colors.green),
            _buildDocTile('PAN Card', 'Verified', Colors.green),
            _buildDocTile('Vehicle RC', 'Verified', Colors.green),
            _buildDocTile('Insurance', 'Verified', Colors.green),
            _buildDocTile('Bank Details', 'Verified', Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(
    ThemeData theme,
    BuildContext context,
    WidgetRef ref,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Column(
          children: [
            _buildSettingsTile(
              Icons.notifications_outlined,
              'Notifications',
              onTap: () => context.push('/notifications'),
            ),
            _buildSettingsTile(
              Icons.language,
              'Language',
              subtitle: 'English',
              onTap: () {},
            ),
            _buildSettingsTile(
              Icons.accessibility_new,
              'Accessibility',
              onTap: () {},
            ),
            _buildSettingsTile(
              Icons.help_outline,
              'Help & Support',
              onTap: () => context.push('/support'),
            ),
            _buildSettingsTile(Icons.info_outline, 'About', onTap: () {}),
            const Divider(height: 1),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title: const Text('Logout', style: TextStyle(color: Colors.red)),
              onTap: () async {
                final authService = ref.read(authServiceProvider);
                await authService.logout();
                if (context.mounted) context.go('/login');
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildDocTile(String name, String status, Color statusColor) {
    return ListTile(
      dense: true,
      title: Text(name, style: const TextStyle(fontSize: 14)),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: statusColor.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          status,
          style: TextStyle(
            color: statusColor,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildSettingsTile(
    IconData icon,
    String title, {
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[700]),
      title: Text(title),
      subtitle: subtitle != null
          ? Text(subtitle, style: const TextStyle(fontSize: 12))
          : null,
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String label;
  final String value;
  const _ProfileStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }
}

class _ScoreBar extends StatelessWidget {
  final String label;
  final double value;
  final Color color;
  const _ScoreBar({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
            Text(
              '${(value * 100).toInt()}%',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        LinearProgressIndicator(
          value: value,
          backgroundColor: Colors.grey[200],
          color: color,
          borderRadius: BorderRadius.circular(4),
          minHeight: 6,
        ),
      ],
    );
  }
}
