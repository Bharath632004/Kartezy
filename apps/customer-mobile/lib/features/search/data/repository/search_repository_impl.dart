// lib/features/search/data/repository/search_repository_impl.dart
import 'package:customer_mobile/features/search/data/datasource/search_remote_data_source.dart';
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/shared/models/shared/models/product.dart';

class SearchRepositoryImpl implements SearchRepository {
  final SearchRemoteDataSource _remoteDataSource;

  SearchRepositoryImpl(this._remoteDataSource);

  @override
  Future<SearchResult> searchProducts(String query) async {
    final List<Product> productList = await _remoteDataSource.searchProducts(query: query);
    return SearchResult(
      products: productList,
      stores: const [],
      brands: const [],
      categories: const [],
      suggestions: const [],
      facets: const {},
      totalResults: productList.length,
    );
  }

  @override
  Future<SearchResult> searchStores(String query) async {
    final result = await _remoteDataSource.searchStores(query);
    return SearchResult(
      products: const [],
      stores: result.stores,
      brands: const [],
      categories: const [],
      suggestions: result.suggestions,
      facets: const {},
      totalResults: result.totalResults,
    );
  }

  @override
  Future<SearchResult> searchBrands(String query) async {
    final result = await _remoteDataSource.searchBrands(query);
    return SearchResult(
      products: const [],
      stores: const [],
      brands: result.brands,
      categories: const [],
      suggestions: result.suggestions,
      facets: const {},
      totalResults: result.totalResults,
    );
  }

  @override
  Future<SearchResult> searchCategories(String query) async {
    final result = await _remoteDataSource.searchCategories(query);
    return SearchResult(
      products: const [],
      stores: const [],
      brands: const [],
      categories: result.categories,
      suggestions: result.suggestions,
      facets: const {},
      totalResults: result.totalResults,
    );
  }

  @override
  Future<List<String>> getAutocompleteSuggestions(String query) async {
    return await _remoteDataSource.getAutocompleteSuggestions(query);
  }

  @override
  Future<List<String>> getRecentSearches() async {
    return await _remoteDataSource.getRecentSearches();
  }

  @override
  Future<List<String>> getTrendingSearches() async {
    return await _remoteDataSource.getTrendingSearches();
  }

  @override
  Future<List<String>> getPersonalizedSuggestions() async {
    return await _remoteDataSource.getPersonalizedSuggestions();
  }

  @override
  Future<List<String>> getSeasonalSearches() async {
    return await _remoteDataSource.getSeasonalSearches();
  }

  @override
  Future<void> saveSearchQuery(String query) async {
    await _remoteDataSource.saveSearchQuery(query);
  }

  @override
  Future<void> clearSearchHistory() async {
    await _remoteDataSource.clearSearchHistory();
  }

  @override
  Future<Product> getProductById(String productId) async {
    return await _remoteDataSource.getProductById(productId);
  }

  @override
  Future<List<Product>> getSimilarProducts(String productId) async {
    return await _remoteDataSource.getSimilarProducts(productId);
  }

  @override
  Future<List<Product>> getFrequentlyBoughtTogether(String productId) async {
    return await _remoteDataSource.getFrequentlyBoughtTogether(productId);
  }

  @override
  Future<List<Product>> scanBarcode(String barcode) async {
    return await _remoteDataSource.scanBarcode(barcode);
  }

  @override
  Future<List<Product>> searchByImage(String imagePath) async {
    return await _remoteDataSource.searchByImage(imagePath);
  }
}

/// Provider for search repository
final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  final remoteDataSource = ref.read(searchRemoteDataSourceProvider);
  return SearchRepositoryImpl(remoteDataSource);
});
