// lib/features/home/home_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/banner/domain/usecase/get_banners_usecase.dart';
import 'package:customer_mobile/features/categories/domain/usecase/get_categories_usecase.dart';
import 'package:customer_mobile/features/products/domain/usecase/get_products_by_filter_use_case.dart';
import 'package:customer_mobile/features/wallet/domain/usecase/get_wallet_balance_use_case.dart';
import 'package:customer_mobile/shared/models/banner.dart';
import 'package:customer_mobile/shared/models/category.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:shimmer/shimmer.dart';
import 'package:cached_network_image/cached_network_image.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch all the data we need for the home page
    final bannersAsync = ref.watch(getBannersUseCaseProvider);
    final categoriesAsync = ref.watch(getCategoriesUseCaseProvider);
    final walletBalanceAsync = ref.watch(getWalletBalanceUseCaseProvider);

    // Product sections
    final flashSaleAsync = ref.watch(getProductsByFutureProvider('flash_sale'));
    final trendingAsync = ref.watch(getProductsByFutureProvider('trending'));
    final recommendedAsync = ref.watch(getProductsByFutureProvider('recommended'));
    final continueShoppingAsync = ref.watch(getProductsByFutureProvider('continue_shopping'));
    final recentlyViewedAsync = ref.watch(getProductsByFutureProvider('recently_viewed'));
    final popularBrandsAsync = ref.watch(getProductsByFutureProvider('popular_brands')); // Assuming we have a brand filter
    final bestSellersAsync = ref.watch(getProductsByFutureProvider('best_sellers'));
    final seasonalCollectionsAsync = ref.watch(getProductsByFutureProvider('seasonal'));
    final sponsoredAsync = ref.watch(getProductsByFutureProvider('sponsored'));
    final newArrivalsAsync = ref.watch(getProductsByFutureProvider('new_arrivals'));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kartezy'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              // TODO: Go to profile
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              // TODO: Implement logout
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Carousel
            bannersAsync.when(
              data: (banners) => Container(
                height: 180,
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: PageView.builder(
                  itemCount: banners.length,
                  itemBuilder: (context, index) {
                    final banner = banners[index];
                    return ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: CachedNetworkImage(
                        imageUrl: banner.imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Shimmer.fromColors(
                          baseColor: Colors.grey[300]!,
                          highlightColor: Colors.grey[100]!,
                          child: Container(
                            color: Colors.white,
                          ),
                        ),
                        errorWidget: (context, url, error) => const Icon(Icons.error),
                      ),
                    );
                  },
                ),
              ),
              loading: () => Container(
                height: 180,
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.grey[300],
                ),
                child: const Center(child: CircularProgressIndicator()),
              ),
              error: (e, _) => Container(
                height: 180,
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.grey[300],
                ),
                child: Center(child: Text('Error: $e')),
              ),
            ),

            // Delivery ETA
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Icon(Icons.location_on, color: Theme.of(context).primaryColor),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Delivering to',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          'Current Location',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () {
                      // TODO: Change address
                    },
                  ),
                ],
              ),
            ),

            // Wallet Summary - NOW WITH REAL DATA
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Icon(Icons.account_balance_wallet, color: Theme.of(context).primaryColor),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Wallet Balance',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        walletBalanceAsync.when(
                          data: (balance) => Text(
                            '\$${balance.toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          loading: () => const Text(
                            '\$0.00',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          error: (e, _) => Text(
                            '\$0.00',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_circle),
                    onPressed: () {
                      // TODO: Add money to wallet
                    },
                  ),
                ],
              ),
            ),

            // Membership Banner
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16.0),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.star, color: Theme.of(context).primaryColor),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Become a Member',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).primaryColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Enjoy free delivery and exclusive discounts',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: Go to membership page
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                    ),
                    child: const Text('Join Now'),
                  ),
                ],
              ),
            ),

            // Categories Grid
            categoriesAsync.when(
              data: (categories) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Categories',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    height: 100,
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: categories.length,
                      itemBuilder: (context, index) {
                        final category = categories[index];
                        return Column(
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              margin: const EdgeInsets.only(right: 12),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                color: Colors.grey[200],
                              ),
                              child: Center(
                                child: CachedNetworkImage(
                                  imageUrl: category.imageUrl,
                                  fit: BoxFit.cover,
                                  placeholder: (context, url) => Shimmer.fromColors(
                                    baseColor: Colors.grey[300]!,
                                    highlightColor: Colors.grey[100]!,
                                    child: Container(
                                      color: Colors.white,
                                    ),
                                  ),
                                  errorWidget: (context, url, error) => const Icon(Icons.error),
                                ),
                              ),
                            ),
                            Text(
                              category.name,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ],
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
            ),

            const SizedBox(height: 24),
            // Flash Sale
            _buildSectionWithProducts(
              context: context,
              title: 'Flash Sale',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: flashSaleAsync,
            ),

            const SizedBox(height: 24),
            // Trending Products
            _buildSectionWithProducts(
              context: context,
              title: 'Trending Products',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: trendingAsync,
            ),

            const SizedBox(height: 24),
            // Recommended For You
            _buildSectionWithProducts(
              context: context,
              title: 'Recommended For You',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: recommendedAsync,
            ),

            const SizedBox(height: 24),
            // Continue Shopping
            _buildSectionWithProducts(
              context: context,
              title: 'Continue Shopping',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: continueShoppingAsync,
            ),

            const SizedBox(height: 24),
            // Recently Viewed
            _buildSectionWithProducts(
              context: context,
              title: 'Recently Viewed',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: recentlyViewedAsync,
            ),

            const SizedBox(height: 24),
            // Popular Brands (using product list as placeholder; ideally would have brand model)
            _buildSectionWithProducts(
              context: context,
              title: 'Popular Brands',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: popularBrandsAsync,
            ),

            const SizedBox(height: 24),
            // Best Sellers
            _buildSectionWithProducts(
              context: context,
              title: 'Best Sellers',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: bestSellersAsync,
            ),

            const SizedBox(height: 24),
            // Seasonal Collections
            _buildSectionWithProducts(
              context: context
              title: 'Seasonal Collections',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: seasonalCollectionsAsync,
            ),

            const SizedBox(height: 24),
            // Sponsored Products
            _buildSectionWithProducts(
              context: context,
              title: 'Sponsored Products',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: sponsoredAsync,
            ),

            const SizedBox(height: 24),
            // Coupons & Offers - NEW SECTION
            _buildCouponsSection(
              context: context,
              title: 'Coupons & Offers',
              onSeeAll: () {}, // TODO: Implement
              couponsAsync: _getCouponsProvider(ref), // TODO: Create actual coupons provider
            ),

            const SizedBox(height: 24),
            // Featured Stores - NEW SECTION
            _buildFeaturedStoresSection(
              context: context,
              title: 'Featured Stores',
              onSeeAll: () {}, // TODO: Implement
              storesAsync: _getStoresProvider(ref), // TODO: Create actual stores provider
            ),

            const SizedBox(height: 24),
            // New Arrivals
            _buildSectionWithProducts(
              context: context,
              title: 'New Arrivals',
              onSeeAll: () {}, // TODO: Implement
              productsAsync: newArrivalsAsync,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionWithProducts({
    required BuildContext context,
    required String title,
    required VoidCallback onSeeAll,
    required AsyncValue<List<Product>> productsAsync,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: onSeeAll,
                child: const Text('See All'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        productsAsync.when(
          data: (products) => Container(
            height: 200,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return Container(
                  width: 160,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[200],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CachedNetworkImage(
                        imageUrl: product.imageUrl,
                        height: 80,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Shimmer.fromColors(
                          baseColor: Colors.grey[300]!,
                          highlightColor: Colors.grey[100]!,
                          child: Container(
                            color: Colors.white,
                          ),
                        ),
                        errorWidget: (context, url, error) => const Icon(Icons.error),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        product.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        '\$${product.salePrice?.toStringAsFixed(2) ?? product.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: product.salePrice != null ? Colors.red : null,
                        ),
                      ),
                      if (product.salePrice != null && product.salePrice! < product.price)
                        Text(
                          '\$${product.price.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
          loading: () => Container(
            height: 200,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 5, // Show 5 placeholder items
              itemBuilder: (context, index) => Container(
                width: 160,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey[300],
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.image, size: 48),
                    SizedBox(height: 8),
                    Text('Product Name', textAlign: TextAlign.center),
                    Text('\$0.00', style: TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
          ),
          error: (e, _) => Container(
            height: 200,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('Error: $e')),
          ),
        ),
      ],
    );
  }

  // TODO: Create actual coupon model and data source
  Widget _buildCouponsSection({
    required BuildContext context,
    required String title,
    required VoidCallback onSeeAll,
    required AsyncValue<List<dynamic>> couponsAsync,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: onSeeAll,
                child: const Text('See All'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        couponsAsync.when(
          data: (coupons) => Container(
            height: 100,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: coupons.length,
              itemBuilder: (context, index) {
                final coupon = coupons[index];
                return Container(
                  width: 160,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[200],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.coupon, size: 48),
                      const SizedBox(height: 8),
                      Text(
                        'Save \$5',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      Text(
                        'CODE: SAVE5',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            ),
          ),
          loading: () => Container(
            height: 100,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3, // Show 3 placeholder items
              itemBuilder: (context, index) => Container(
                width: 160,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey[300],
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.coupon, size: 48),
                    const SizedBox(height: 8),
                    Text('Coupon', textAlign: TextAlign.center),
                    Text('CODE: XXXX', textAlign: TextAlign.center),
                  ],
                ),
              ),
            ),
          ),
          error: (e, _) => Container(
            height: 100,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('Error: $e')),
          ),
        ),
      ],
    );
  }

  // TODO: Create actual store model and data source
  Widget _buildFeaturedStoresSection({
    required BuildContext context,
    required String title,
    required VoidCallback onSeeAll,
    required AsyncValue<List<dynamic>> storesAsync,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: onSeeAll,
                child: const Text('See All'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        storesAsync.when(
          data: (stores) => Container(
            height: 120,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: stores.length,
              itemBuilder: (context, index) {
                final store = stores[index];
                return Container(
                  width: 160,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[200],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.store, size: 48),
                      const SizedBox(height: 8),
                      Text(
                        'Store Name',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '4.5 ★',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.orange,
                        ),
                      ),
                      Text(
                        '2.3 km away',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          loading: () => Container(
            height: 120,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3, // Show 3 placeholder items
              itemBuilder: (context, index) => Container(
                width: 160,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey[300],
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.store, size: 48),
                    const SizedBox(height: 8),
                    Text('Store Name', textAlign: TextAlign.center),
                    Text('4.5 ★', textAlign: TextAlign.center),
                    Text('2.3 km away', textAlign: TextAlign.center),
                  ],
                ),
              ),
            ),
          ),
          error: (e, _) => Container(
            height: 120,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('Error: $e')),
          ),
        ),
      ],
    );
  }

  // TODO: Replace with actual coupons provider when coupon feature is implemented
  AsyncValue<List<dynamic>> _getCouponsProvider(WidgetRef ref) {
    // Returning a dummy async value for now - replace with actual provider
    return const AsyncData<List<dynamic>>([]);
  }

  // TODO: Replace with actual stores provider when store feature is implemented
  AsyncValue<List<dynamic>> _getStoresProvider(WidgetRef ref) {
    // Returning a dummy async value for now - replace with actual provider
    return const AsyncData<List<dynamic>>([]);
  }
}

// Helper provider to get products by filter string
final getProductsByFutureProvider = FutureProvider.family<List<Product>, String>((ref, filter) {
  final useCase = ref.read(getProductsByFilterUseCaseProvider);
  return useCase.call(filter);
});