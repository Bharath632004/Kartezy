import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Safety features page for delivery partners.
class SafetyPage extends ConsumerWidget {
  const SafetyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Safety Center')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Emergency SOS Button
            _buildEmergencySOS(theme, context),
            const SizedBox(height: 24),
            // Trusted Contacts
            _buildSectionHeader(
              'Trusted Contacts',
              onTap: () => context.push('/safety/trusted-contacts'),
            ),
            const SizedBox(height: 12),
            _buildTrustedContacts(theme),
            const SizedBox(height: 24),
            // Safety Tools
            _buildSectionHeader('Safety Tools'),
            const SizedBox(height: 12),
            _buildSafetyTool(
              theme,
              Icons.share_location,
              'Location Sharing',
              'Share your live location with trusted contacts',
              Colors.blue,
              () {},
            ),
            _buildSafetyTool(
              theme,
              Icons.trip_origin,
              'Trip Sharing',
              'Share trip details with someone you trust',
              Colors.green,
              () {},
            ),
            _buildSafetyTool(
              theme,
              Icons.warning_amber,
              'Unsafe Area Report',
              'Report unsafe locations to help other partners',
              Colors.orange,
              () {},
            ),
            _buildSafetyTool(
              theme,
              Icons.report_problem,
              'Report Incident',
              'Report an accident, breakdown, or other incident',
              Colors.red,
              () {
                context.push('/safety/report-incident');
              },
            ),
            const SizedBox(height: 24),
            // Safety Tips
            _buildSectionHeader('Safety Tips'),
            const SizedBox(height: 12),
            _buildSafetyTip(
              theme,
              'Always verify customer OTP before handing over the order',
            ),
            _buildSafetyTip(theme, 'Keep your phone charged during shifts'),
            _buildSafetyTip(theme, 'Use well-lit areas for night deliveries'),
            _buildSafetyTip(theme, 'Follow traffic rules at all times'),
            _buildSafetyTip(theme, 'Keep emergency contacts updated'),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencySOS(ThemeData theme, BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFF1744), Color(0xFFFF5252)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(Icons.emergency_share, size: 48, color: Colors.white),
          const SizedBox(height: 12),
          const Text(
            'Emergency SOS',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Press and hold to send emergency alert',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _triggerSOS(context),
              icon: const Icon(Icons.sos, size: 24),
              label: const Text(
                'SOS - EMERGENCY',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.red,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustedContacts(ThemeData theme) {
    final contacts = [
      {'name': 'Amit Kumar', 'phone': '+91-9876543210', 'relation': 'Brother'},
      {'name': 'Sunita Devi', 'phone': '+91-9876543211', 'relation': 'Wife'},
    ];

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          ...contacts.map(
            (c) => ListTile(
              leading: CircleAvatar(
                backgroundColor: theme.colorScheme.primaryContainer,
                child: Text(
                  c['name']![0],
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              title: Text(
                c['name']!,
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
              subtitle: Text(
                '${c['relation']} • ${c['phone']}',
                style: const TextStyle(fontSize: 12),
              ),
              trailing: IconButton(
                icon: const Icon(Icons.phone, color: Colors.green),
                onPressed: () {},
              ),
            ),
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.green.withValues(alpha: 0.1),
              child: const Icon(Icons.add, color: Colors.green),
            ),
            title: const Text(
              'Add Trusted Contact',
              style: TextStyle(
                color: Colors.green,
                fontWeight: FontWeight.w500,
              ),
            ),
            onTap: () => context.push('/safety/add-contact'),
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyTool(
    ThemeData theme,
    IconData icon,
    String title,
    String subtitle,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }

  Widget _buildSafetyTip(ThemeData theme, String tip) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check_circle, size: 18, color: Colors.green[600]),
          const SizedBox(width: 8),
          Expanded(child: Text(tip, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, {VoidCallback? onTap}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        if (onTap != null)
          TextButton(onPressed: onTap, child: const Text('View All')),
      ],
    );
  }

  void _triggerSOS(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.warning, color: Colors.red, size: 28),
            SizedBox(width: 8),
            Text('Emergency SOS', style: TextStyle(color: Colors.red)),
          ],
        ),
        content: const Text(
          'This will send your location to emergency contacts and notify support. Are you sure?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('SOS alert sent! Help is on the way.'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Send SOS'),
          ),
        ],
      ),
    );
  }
}
