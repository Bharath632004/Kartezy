import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SupportPage extends ConsumerWidget {
  final String? ticketId;

  const SupportPage({super.key, this.ticketId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(ticketId != null ? 'Ticket #$ticketId' : 'Help & Support'),
      ),
      body: ticketId != null
          ? _buildTicketDetail(context, theme)
          : _buildSupportHome(context, theme),
    );
  }

  Widget _buildSupportHome(BuildContext context, ThemeData theme) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Help Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.primaryColor,
                theme.primaryColor.withValues(alpha:0.8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              const Icon(Icons.support_agent, color: Colors.white, size: 48),
              const SizedBox(height: 12),
              Text(
                'How can we help you?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Search help articles...',
                  hintStyle: TextStyle(
                    color: Colors.white.withValues(alpha:0.6),
                  ),
                  prefixIcon: Icon(
                    Icons.search,
                    color: Colors.white.withValues(alpha:0.8),
                  ),
                  filled: true,
                  fillColor: Colors.white.withValues(alpha:0.15),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Quick Help Options
        Text(
          'Quick Help',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        _buildHelpOption(
          context,
          Icons.chat_outlined,
          'Live Chat',
          'Chat with our support team',
        ),
        _buildHelpOption(
          context,
          Icons.phone_outlined,
          'Call Us',
          'Speak to a representative',
        ),
        _buildHelpOption(
          context,
          Icons.email_outlined,
          'Email Support',
          'We\'ll respond within 24 hrs',
        ),
        _buildHelpOption(
          context,
          Icons.article_outlined,
          'FAQs',
          'Find answers to common questions',
        ),
        _buildHelpOption(
          context,
          Icons.confirmation_number_outlined,
          'My Tickets',
          'Track your support tickets',
        ),

        const SizedBox(height: 24),

        // FAQ Section
        Text(
          'Frequently Asked Questions',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ExpansionTile(
          title: const Text('How do I track my order?'),
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'You can track your order in real-time from the Orders section. Tap on your order to see live tracking with the delivery partner\'s location.',
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
            ),
          ],
        ),
        ExpansionTile(
          title: const Text('What is the return policy?'),
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'You can request a return within 7 days of delivery for most products. Some products may have specific return policies mentioned on the product page.',
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
            ),
          ],
        ),
        ExpansionTile(
          title: const Text('How do I contact the merchant?'),
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'You can contact the merchant directly through the Order Details page. Tap on the merchant name and select "Contact Merchant" to start a chat.',
                style: TextStyle(color: Colors.grey[600], fontSize: 13),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildHelpOption(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
  ) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey[200]!),
      ),
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: theme.primaryColor.withValues(alpha:0.08),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: theme.primaryColor, size: 22),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }

  Widget _buildTicketDetail(BuildContext context, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Ticket #$ticketId',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange[50],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Open',
                          style: TextStyle(
                            color: Colors.orange[700],
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Order related inquiry',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Type your message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      child: const Text('Send Message'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
