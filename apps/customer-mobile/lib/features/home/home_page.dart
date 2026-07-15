import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:geolocator/geolocator.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: CustomScrollView(
        slivers: [
          // App Bar with Location & Search
          SliverAppBar(
            floating: true,
            pinned: false,
            backgroundColor: theme.primaryColor,
            expandedHeight: 140,
            collapsedHeight: 120,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      theme.primaryColor,
                      theme.primaryColor.withOpacity(0.9),
                    ],
                  ),
                ),
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Location & Notification Row
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.location_on_outlined,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Deliver to',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.7),
                                      fontSize: 11,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () async {
                                      final position = await Geolocator.getCurrentPosition();
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: Text('Location: ${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}'),
                                            behavior: SnackBarBehavior.floating,
                                          ),
                                        );
                                      }
                                    },
                                    child: Row(
                                      children: [
                                        Text(
                                          'Home',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Icon(
                                          Icons.keyboard_arrow_down,
                                          color: Colors.white.withOpacity(0.8),
                                          size: 18,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Notifications
                            Stack(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.notifications_outlined,
                                      color: Colors.white),
                                  onPressed: () => context.push('/notifications'),
                                ),
                                Positioned(
                                  right: 8,
                                  top: 8,
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Colors.red,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            // Wallet
                            GestureDetector(
                              onTap: () => context.push('/wallet'),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.account_balance_wallet_outlined,
                                        color: Colors.white, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      '₹0',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        // Search Bar
                        Material(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          elevation: 2,
                          shadowColor: Colors.black.withOpacity(0.1),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () => context.push('/search'),
                            child: Container(
                              height: 44,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Row(
                                children: [
                                  Icon(Icons.search, color: Colors.grey[400], size: 20),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      'Search products, stores, brands...',
                                      style: TextStyle(
                                        color: Colors.grey[400],
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: 1,
                                    height: 24,
                                    color: Colors.grey[200],
                                  ),
                                  const SizedBox(width: 8),
                                  Icon(Icons.mic_outlined,
                                      color: theme.primaryColor, size: 20),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Main Content
          SliverToBoxAdapter(
            child: Column(
              children: [
                // Flash Deals Banner
                _buildFlashDealsSection(context, theme),

                // Categories Grid
                _buildCategoriesSection(context, theme),

                // Top Offers Banner
                _buildTopOffersBanner(context, theme),

                // Featured Stores
                _buildFeaturedStoresSection(context, theme),

                // Trending Products
                _buildTrendingSection(context, theme),

                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlashDealsSection(BuildContext context, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.deepOrange, Colors.orange[400]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.flash_on, color: Colors.white, size: 20),
                    const SizedBox(width: 4),
                    Text(
                      'Flash Deals',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Limited time offers ending soon',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 8),
                // Timer placeholder
                Row(
                  children: [
                    _buildTimerChip('02'),
                    const SizedBox(width: 4),
                    Text(':', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 4),
                    _buildTimerChip('45'),
                    const SizedBox(width: 4),
                    Text(':', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 4),
                    _buildTimerChip('30'),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.local_offer, color: Colors.white, size: 40),
          ),
        ],
      ),
    );
  }

  Widget _buildTimerChip(String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        value,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 16,
        ),
      ),
    );
  }

  Widget _buildCategoriesSection(BuildContext context, ThemeData theme) {
    final categories = [
      _CategoryData('Groceries', Icons.shopping_bag_outlined),
      _CategoryData('Fruits & Veg', Icons.spa_outlined),
      _CategoryData('Dairy', Icons.egg_outlined),
      _CategoryData('Bakery', Icons.bakery_dining_outlined),
      _CategoryData('Pharmacy', Icons.medication_outlined),
      _CategoryData('Stationery', Icons.edit_outlined),
      _CategoryData('Electronics', Icons.devices_outlined),
      _CategoryData('Home', Icons.home_outlined),
      _CategoryData('Cosmetics', Icons.face_outlined),
      _CategoryData('Gifts', Icons.card_giftcard_outlined),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Shop by Category',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 110,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final cat = categories[index];
              return GestureDetector(
                onTap: () => context.push('/search?category=${cat.name}'),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(cat.icon, color: theme.primaryColor, size: 28),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: 72,
                      child: Text(
                        cat.name,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildTopOffersBanner(BuildContext context, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.purple[400]!, Colors.purple[300]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Get ₹100 OFF',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'on your first order! Use code WELCOME100',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'WELCOME100',
                    style: TextStyle(
                      color: theme.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.percent, color: Colors.white.withOpacity(0.3), size: 64),
        ],
      ),
    );
  }

  Widget _buildFeaturedStoresSection(BuildContext context, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Featured Stores',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: const Text('View All', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 180,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 0,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, __) => const SizedBox.shrink(),
          ),
        ),
        // Empty state for stores
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Icon(Icons.store_outlined, size: 40, color: Colors.grey[300]),
                const SizedBox(height: 8),
                Text(
                  'Discover nearby stores',
                  style: TextStyle(color: Colors.grey[500], fontSize: 13),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildTrendingSection(BuildContext context, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Trending Near You',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () => context.push('/search'),
                child: const Text('View All', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 220,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 0,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, __) => const SizedBox.shrink(),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Icon(Icons.trending_up, size: 40, color: Colors.grey[300]),
                const SizedBox(height: 8),
                Text(
                  'Trending products will appear here',
                  style: TextStyle(color: Colors.grey[500], fontSize: 13),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProductCard(BuildContext context, ThemeData theme) {
    return Container(
      width: 150,
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: Container(
              height: 110,
              color: Colors.grey[100],
              child: const Center(
                child: Icon(Icons.image_outlined, color: Colors.grey),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 120,
                  height: 12,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  width: 80,
                  height: 12,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    const Spacer(),
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.add, color: theme.primaryColor, size: 18),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryData {
  final String name;
  final IconData icon;

  const _CategoryData(this.name, this.icon);
}
