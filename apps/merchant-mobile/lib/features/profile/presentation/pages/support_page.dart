import 'package:flutter/material.dart';

class SupportPage extends StatefulWidget {
  const SupportPage({super.key});

  @override
  State<SupportPage> createState() => _SupportPageState();
}

class _SupportPageState extends State<SupportPage> {
  final Set<int> _expandedFaqs = {};

  static const List<Map<String, String>> _faqs = [
    {
      'q': 'How do I add a new product?',
      'a':
          'Go to Products → tap + icon → fill in product details → tap Add Product.',
    },
    {
      'q': 'How do I manage inventory?',
      'a':
          'Navigate to Inventory section to view stock levels. Tap on an item to adjust stock or transfer between warehouses.',
    },
    {
      'q': 'How do I create a promotion?',
      'a':
          'Go to Promotions → tap + → select promotion type → set discount value and dates → save.',
    },
    {
      'q': 'How do I view my earnings?',
      'a':
          'Visit the Finance Dashboard to see revenue, settlements, and wallet balance.',
    },
    {
      'q': 'How do I contact support?',
      'a':
          'Use the contact options below to reach our support team via email or phone.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Contact Cards
          _buildContactCard(
            icon: Icons.email,
            title: 'Email Us',
            subtitle: 'support@kartezy.com',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _buildContactCard(
            icon: Icons.phone,
            title: 'Call Us',
            subtitle: '+1-800-KARTEZY',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _buildContactCard(
            icon: Icons.chat,
            title: 'Live Chat',
            subtitle: 'Available 9 AM - 9 PM',
            onTap: () {},
          ),
          const SizedBox(height: 24),
          // FAQ Section
          Text(
            'Frequently Asked Questions',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          ..._faqs.asMap().entries.map(
            (entry) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ExpansionTile(
                title: Text(entry.value['q']!),
                initiallyExpanded: _expandedFaqs.contains(entry.key),
                onExpansionChanged: (expanded) {
                  setState(() {
                    if (expanded) {
                      _expandedFaqs.add(entry.key);
                    } else {
                      _expandedFaqs.remove(entry.key);
                    }
                  });
                },
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Text(entry.value['a']!),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Report Issue
          Card(
            child: ListTile(
              leading: const Icon(Icons.bug_report),
              title: const Text('Report an Issue'),
              subtitle: const Text('Found a bug? Let us know'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Report an Issue'),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextField(
                          maxLines: 4,
                          decoration: InputDecoration(
                            hintText: 'Describe the issue...',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ],
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
                              content: Text(
                                'Issue reported. We will look into it.',
                              ),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        child: const Text('Submit'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(
            context,
          ).colorScheme.primary.withValues(alpha:0.1),
          child: Icon(icon, color: Theme.of(context).colorScheme.primary),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
