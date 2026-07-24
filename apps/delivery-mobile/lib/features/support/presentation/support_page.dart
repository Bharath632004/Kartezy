import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Support page for delivery partners.
class SupportPage extends ConsumerWidget {
  const SupportPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick Help
            _buildQuickHelp(theme, context),
            const SizedBox(height: 24),
            // FAQ Section
            _buildSectionHeader('Frequently Asked Questions'),
            const SizedBox(height: 12),
            _buildFAQSection(theme, context),
            const SizedBox(height: 24),
            // Contact Options
            _buildSectionHeader('Contact Us'),
            const SizedBox(height: 12),
            _buildContactOption(
              theme,
              Icons.chat_bubble_outline,
              'Live Chat',
              'Chat with our support team',
              Colors.blue,
              () {},
            ),
            _buildContactOption(
              theme,
              Icons.phone_outlined,
              'Call Support',
              'Speak with an agent',
              Colors.green,
              () {},
            ),
            _buildContactOption(
              theme,
              Icons.email_outlined,
              'Email Us',
              'Send us an email',
              Colors.orange,
              () {},
            ),
            const SizedBox(height: 24),
            // Report Issues
            _buildSectionHeader('Report Issues'),
            const SizedBox(height: 12),
            _buildReportOption(
              theme,
              Icons.build,
              'Vehicle Breakdown',
              'Report a vehicle issue',
              () {},
            ),
            _buildReportOption(
              theme,
              Icons.car_crash,
              'Accident Report',
              'Report an accident',
              () {},
            ),
            _buildReportOption(
              theme,
              Icons.warning_amber,
              'App Issue',
              'Report a bug or problem',
              () {},
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickHelp(ThemeData theme, BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            theme.colorScheme.primaryContainer,
            theme.colorScheme.secondaryContainer,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.support_agent, size: 40, color: Colors.blue),
          const SizedBox(height: 12),
          Text(
            'How can we help?',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Search for help topics or contact our support team',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: InputDecoration(
              hintText: 'Search help topics...',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: theme.colorScheme.surface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFAQSection(ThemeData theme, BuildContext context) {
    final faqs = [
      {
        'q': 'How do I go online?',
        'a':
            'Tap the "Start Shift" button on the dashboard to go online and start receiving orders.',
      },
      {
        'q': 'How is my earnings calculated?',
        'a':
            'You earn delivery fees, tips, bonuses, and incentives. Check the earnings page for detailed breakdown.',
      },
      {
        'q': 'How do I verify a delivery?',
        'a':
            'Enter the OTP provided by the customer in the delivery verification screen.',
      },
      {
        'q': 'What if I can\'t find the customer?',
        'a':
            'Use the call or chat feature to contact the customer. If unreachable, follow the in-app instructions.',
      },
      {
        'q': 'How do I withdraw money?',
        'a':
            'Go to Earnings > Wallet and tap "Withdraw" to transfer to your bank account.',
      },
    ];

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: faqs
            .map(
              (faq) => ExpansionTile(
                tilePadding: const EdgeInsets.symmetric(horizontal: 16),
                childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                title: Text(
                  faq['q']!,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
                children: [
                  Text(
                    faq['a']!,
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
            )
            .toList(),
      ),
    );
  }

  Widget _buildContactOption(
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

  Widget _buildReportOption(
    ThemeData theme,
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: Colors.red[400]),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
    );
  }
}
