import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/marketing_service.dart';

class MarketingDashboardPage extends ConsumerWidget {
  const MarketingDashboardPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final marketingState = ref.watch(marketingProvider);
    final marketingNotifier = ref.read(marketingProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Marketing Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              marketingNotifier.loadSponsoredProducts();
              marketingNotifier.loadFeaturedProducts();
              marketingNotifier.loadBannerCampaigns();
            },
          ),
        ],
      ),
      body: marketingState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : marketingState.error != null
              ? Center(child: Text('Error: ${marketingState.error}'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sponsored Products
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Sponsored Products',
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 8),
                              SizedBox(
                                height: 120,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: (marketingState.sponsoredProducts ?? []).length,
                                  itemBuilder: (context, index) {
                                    final product = marketingState.sponsoredProducts![index];
                                    return Container(
                                      width: 120,
                                      margin: const EdgeInsets.only(right: 12),
                                      child: Card(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              product['name'] ?? 'Unknown Product',
                                              style: const TextStyle(fontWeight: FontWeight.bold),
                                            ),
                                            Text('Spend: \$${product['spend'] ?? 0}'),
                                            Text('Clicks: ${product['clicks'] ?? 0}'),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Featured Products
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Featured Products',
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 8),
                              SizedBox(
                                height: 120,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: (marketingState.featuredProducts ?? []).length,
                                  itemBuilder: (context, index) {
                                    final product = marketingState.featuredProducts![index];
                                    return Container(
                                      width: 120,
                                      margin: const EdgeInsets.only(right: 12),
                                      child: Card(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              product['name'] ?? 'Unknown Product',
                                              style: const TextStyle(fontWeight: FontWeight.bold),
                                            ),
                                            Text('Views: ${product['views'] ?? 0}'),
                                            Text('Conversions: ${product['conversions'] ?? 0}'),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Banner Campaigns
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Text(
                    'Banner Campaigns',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: (marketingState.bannerCampaigns ?? []).length,
                    itemBuilder: (context, index) {
                      final campaign = marketingState.bannerCampaigns![index];
                      return ListTile(
                        title: Text(campaign['name'] ?? 'Unnamed Campaign'),
                        subtitle: Text('Impressions: ${campaign['impressions'] ?? 0}'),
                        trailing: Text('CTR: ${(campaign['click_through_rate'] ?? 0).toStringAsFixed(2)}%'),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
                    ],
                  ),
                ),
    );
  }
}