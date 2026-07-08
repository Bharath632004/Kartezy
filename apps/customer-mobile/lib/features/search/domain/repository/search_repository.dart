// lib/features/search/domain/repository/search_repository.dart
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:customer_mobile/shared/models/product.dart';

abstract class SearchRepository {
  Future<SearchResult> searchProducts(String query);
  Future<SearchResult> searchStores(String query);
  Future<SearchResult> searchBrands(String query);
  Future<SearchResult> searchCategories(String query);

  Future<List<String>> getAutocompleteSuggestions(String query);
  Future<List<String>> getRecentSearches();
  Future<List<String>> getTrendingSearches();
  Future<List<String>> getPersonalizedSuggestions();
  Future<List<String>> getSeasonalSearches();

  Future<void> saveSearchQuery(String query);
  Future<void> clearSearchHistory();

  Future<Product> getProductById(String productId);
  Future<List<Product>> getSimilarProducts(String productId);
  Future<List<Product>> getFrequentlyBoughtTogether(String productId);

  Future<List<Product>> scanBarcode(String barcode);
  Future<List<Product>> searchByImage(String imagePath);
}
