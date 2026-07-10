// lib/features/search/data/datasource/search_remote_data_source.dart
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/shared/models/store.dart';
import 'package:customer_mobile/shared/models/brand.dart';
import 'package:customer_mobile/shared/models/category.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class SearchRemoteDataSource {
  Future<List<Product>> searchProducts({
    required String query,
    int limit = 20,
    int offset = 0,
    Map<String, dynamic>? filters,
    String? sortBy,
  });

  Future<List<String>> getAutocompleteSuggestions(String query);
  Future<List<String>> getRecentSearches();
  Future<List<String>> getTrendingSearches();
  Future<List<String>> getPersonalizedSuggestions();
  Future<List<String>> getSeasonalSearches();
  Future<SearchResult> searchStores(String query);
  Future<SearchResult> searchBrands(String query);
  Future<SearchResult> searchCategories(String query);

  Future<Product> getProductById(String productId);
  Future<List<Product>> getSimilarProducts(String productId);
  Future<List<Product>> getFrequentlyBoughtTogether(String productId);

  Future<void> saveSearchQuery(String query);
  Future<void> clearSearchHistory();

  Future<List<Product>> scanBarcode(String barcode);
  Future<List<Product>> searchByImage(String imagePath);
}

class SearchRemoteDataSourceImpl implements SearchRemoteDataSource {
  final Ref _ref;

  SearchRemoteDataSourceImpl(this._ref);

  @override
  Future<List<Product>> searchProducts({
    required String query,
    int limit = 20,
    int offset = 0,
    Map<String, dynamic>? filters,
    String? sortBy,
  }) async {
    final dio = _ref.read(dioProvider);

    final response = await dio.post(
      '/search/products',
      data: {
        'query': query,
        'limit': limit,
        'offset': offset,
        'filters': filters,
        'sort_by': sortBy,
      },
    );

    final List<dynamic> data = response.data['products'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }

  @override
  Future<List<String>> getAutocompleteSuggestions(String query) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get(
      '/search/suggest',
      queryParameters: {'q': query, 'limit': 10},
    );

    final List<dynamic> data = response.data['suggestions'] ?? [];
    return data.map((e) => e.toString()).toList();
  }

  @override
  Future<List<String>> getRecentSearches() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/search/history/recent');

    final List<dynamic> data = response.data['searches'] ?? [];
    return data.map((e) => e.toString()).toList();
  }

  @override
  Future<List<String>> getTrendingSearches() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/search/trending');

    final List<dynamic> data = response.data['searches'] ?? [];
    return data.map((e) => e.toString()).toList();
  }

  @override
  Future<List<String>> getPersonalizedSuggestions() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/search/personalized');

    final List<dynamic> data = response.data['suggestions'] ?? [];
    return data.map((e) => e.toString()).toList();
  }

  @override
  Future<List<String>> getSeasonalSearches() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/search/seasonal');

    final List<dynamic> data = response.data['searches'] ?? [];
    return data.map((e) => e.toString()).toList();
  }

  @override
  Future<SearchResult> searchStores(String query) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      '/search/stores',
      data: {'query': query},
    );

    final List<dynamic> storesData = response.data['stores'] ?? [];
    final List<Store> stores = storesData.map((json) => Store.fromJson(json)).toList();
    final int totalResults = response.data['totalResults'] ?? 0;
    final List<String> suggestions = (response.data['suggestions'] as List<dynamic>?)
        ?.map((e) => e.toString())
        .toList() ?? [];
    final Map<String, dynamic>? facets =
        response.data['facets'] != null ? Map<String, dynamic>.from(response.data['facets']) : null;

    return SearchResult(
      stores: stores,
      products: [], // empty list for other types
      brands: [],
      categories: [],
      suggestions: suggestions,
      facets: facets,
      totalResults: totalResults,
    );
  }

  @override
  Future<SearchResult> searchBrands(String query) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      '/search/brands',
      data: {'query': query},
    );

    final List<dynamic> brandsData = response.data['brands'] ?? [];
    final List<Brand> brands = brandsData.map((json) => Brand.fromJson(json)).toList();
    final int totalResults = response.data['totalResults'] ?? 0;
    final List<String> suggestions = (response.data['suggestions'] as List<dynamic>?)
        ?.map((e) => e.toString())
        .toList() ?? [];
    final Map<String, dynamic>? facets =
        response.data['facets'] != null ? Map<String, dynamic>.from(response.data['facets']) : null;

    return SearchResult(
      brands: brands,
      products: [],
      stores: [],
      categories: [],
      suggestions: suggestions,
      facets: facets,
      totalResults: totalResults,
    );
  }

  @override
  Future<SearchResult> searchCategories(String query) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      '/search/categories',
      data: {'query': query},
    );

    final List<dynamic> categoriesData = response.data['categories'] ?? [];
    final List<Category> categories =
        categoriesData.map((json) => Category.fromJson(json)).toList();
    final int totalResults = response.data['totalResults'] ?? 0;
    final List<String> suggestions = (response.data['suggestions'] as List<dynamic>?)
        ?.map((e) => e.toString())
        .toList() ?? [];
    final Map<String, dynamic>? facets =
        response.data['facets'] != null ? Map<String, dynamic>.from(response.data['facets']) : null;

    return SearchResult(
      categories: categories,
      products: [],
      stores: [],
      brands: [],
      suggestions: suggestions,
      facets: facets,
      totalResults: totalResults,
    );
  }

  @override
  Future<Product> getProductById(String productId) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/products/$productId');
    return Product.fromJson(response.data);
  }

  @override
  Future<List<Product>> getSimilarProducts(String productId) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/products/$productId/similar');

    final List<dynamic> data = response.data['products'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }

  @override
  Future<List<Product>> getFrequentlyBoughtTogether(String productId) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get(
      '/products/$productId/frequently-bought-together',
    );

    final List<dynamic> data = response.data['products'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }

  @override
  Future<void> saveSearchQuery(String query) async {
    final dio = _ref.read(dioProvider);
    await dio.post(
      '/search/history',
      data: {'query': query, 'timestamp': DateTime.now().toIso8601String()},
    );
  }

  @override
  Future<void> clearSearchHistory() async {
    final dio = _ref.read(dioProvider);
    await dio.delete('/search/history');
  }

  @override
  Future<List<Product>> scanBarcode(String barcode) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/search/barcode/$barcode');

    final List<dynamic> data = response.data['products'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }

  @override
  Future<List<Product>> searchByImage(String imagePath) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      '/search/image',
      data: {
        'image':
            imagePath, // In practice, this would be a base64 encoded image or upload token
      },
    );

    final List<dynamic> data = response.data['products'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }
}

/// Provider for search remote data source
final searchRemoteDataSourceProvider = Provider<SearchRemoteDataSource>((ref) {
  return SearchRemoteDataSourceImpl(ref);
});
