// lib/core/providers/home_providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/models/store.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

/// Provider for featured stores
final featuredStoresProvider = FutureProvider<List<Store>>((ref) async {
  final dioClient = ref.read(dioClientProvider);
  final response = await dioClient.get('/stores/featured');
  final stores = (response.data as List)
      .map((json) => Store.fromJson(json as Map<String, dynamic>))
      .toList();
  return stores;
});

/// Provider for trending products
final trendingProductsProvider = FutureProvider<List<Product>>((ref) async {
  final dioClient = ref.read(dioClientProvider);
  final response = await dioClient.get('/products/trending');
  final products = (response.data as List)
      .map((json) => Product.fromJson(json as Map<String, dynamic>))
      .toList();
  return products;
});
