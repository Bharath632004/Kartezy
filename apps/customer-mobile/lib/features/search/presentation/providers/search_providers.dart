// lib/features/search/presentation/providers/search_providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/domain/usecase/search_products_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_recent_searches_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_trending_searches_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_personalized_suggestions_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_seasonal_searches_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_autocomplete_suggestions_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/save_search_query_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/clear_search_history_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_product_details_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_similar_products_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_frequently_bought_together_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/scan_barcode_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/search_by_image_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/search_stores_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/search_brands_usecase.dart';
import 'package:customer_mobile/features/search/domain/usecase/search_categories_usecase.dart';
import 'package:customer_mobile/shared/models/search_result.dart';

// Search results provider
final searchResultsProvider = StateNotifierProvider<SearchResultsNotifier, SearchResult>((ref) {
  return SearchResultsNotifier();
});

class SearchResultsNotifier extends StateNotifier<SearchResult> {
  SearchResultsNotifier() : super(const SearchResult(products: []);

  void updateResults(SearchResult result) {
    state = result;
  }

  void clearResults() {
    state = const SearchResult(products: []);
  }
}

// Recent searches provider
final recentSearchesProvider = FutureProvider<List<String>>((ref) {
  final useCase = ref.read(getRecentSearchesUseCaseProvider);
  return useCase();
});

// Trending searches provider
final trendingSearchesProvider = FutureProvider<List<String>>((ref) {
  final useCase = ref.read(getTrendingSearchesUseCaseProvider);
  return useCase();
});

// Personalized suggestions provider
final personalizedSuggestionsProvider = FutureProvider<List<String>>((ref) {
  final useCase = ref.read(getPersonalizedSuggestionsUseCaseProvider);
  return useCase();
});

// Seasonal searches provider
final seasonalSearchesProvider = FutureProvider<List<String>>((ref) {
  final useCase = ref.read(getSeasonalSearchesUseCaseProvider);
  return useCase();
});

// Autocomplete suggestions provider
final autocompleteSuggestionsProvider = FutureProvider<List<String>>((ref) {
  final useCase = ref.read(getAutocompleteSuggestionsUseCaseProvider);
  return useCase();
});

// Search products use case provider
final searchProductsUseCaseProvider = Provider<SearchProductsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchProductsUseCase(repository);
});

// Search stores use case provider
final searchStoresUseCaseProvider = Provider<SearchStoresUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchStoresUseCase(repository);
});

// Search brands use case provider
final searchBrandsUseCaseProvider = Provider<SearchBrandsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchBrandsUseCase(repository);
});

// Search categories use case provider
final searchCategoriesUseCaseProvider = Provider<SearchCategoriesUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchCategoriesUseCase(repository);
});

// Get suggestions use case provider
final getSuggestionsUseCaseProvider = Provider<GetSuggestionsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetSuggestionsUseCase(repository);
});

// Get autocomplete suggestions use case provider
final getAutocompleteSuggestionsUseCaseProvider = Provider<GetAutocompleteSuggestionsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetAutocompleteSuggestionsUseCase(repository);
});

// Save search query use case provider
final saveSearchQueryUseCaseProvider = Provider<SaveSearchQueryUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SaveSearchQueryUseCase(repository);
});

// Clear search history use case provider
final clearSearchHistoryUseCaseProvider = Provider<ClearSearchHistoryUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return ClearSearchHistoryUseCase(repository);
});

// Get product details use case provider
final getProductDetailsUseCaseProvider = Provider<GetProductDetailsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetProductDetailsUseCase(repository);
});

// Get similar products use case provider
final getSimilarProductsUseCaseProvider = Provider<GetSimilarProductsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetSimilarProductsUseCase(repository);
});

// Get frequently bought together use case provider
final getFrequentlyBoughtTogetherUseCaseProvider = Provider<GetFrequentlyBoughtTogetherUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetFrequentlyBoughtTogetherUseCase(repository);
});

// Scan barcode use case provider
final scanBarcodeUseCaseProvider = Provider<ScanBarcodeUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return ScanBarcodeUseCase(repository);
});

// Search by image use case provider
final searchByImageUseCaseProvider = Provider<SearchByImageUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchByImageUseCase(repository);
});