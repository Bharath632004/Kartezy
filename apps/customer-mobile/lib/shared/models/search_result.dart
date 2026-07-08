// lib/shared/models/search_result.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/shared/models/store.dart';
import 'package:customer_mobile/shared/models/brand.dart';
import 'package:customer_mobile/shared/models/category.dart';

part 'search_result.freezed.dart';
part 'search_result.g.dart';

@freeze
class SearchResult with _$SearchResult {
  const SearchResult({
    required this.products,
    this.stores = const [],
    this.brands = const [],
    this.categories = const [],
    this.totalResults = 0,
    this.suggestions = const [],
    this.facets,
  });

  final List<Product> products;
  final List<Store> stores;
  final List<Brand> brands;
  final List<Category> categories;
  final int totalResults;
  final List<String> suggestions;
  final Map<String, dynamic>?
  facets; // For faceted search (price ranges, ratings, etc.)

  factory SearchResult.fromJson(Map<String, dynamic> json) =>
      _$SearchResultFromJson(json);

  Map<String, dynamic> toJson() => _$SearchResultToJson(this);
}

// Store model (simplified - would be expanded based on actual API)
@freeze
class Store with _$Store {
  const Store({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.distance,
    required this.isOpen,
  });

  final String id;
  final String name;
  final String imageUrl;
  final double distance; // in km or miles
  final bool isOpen;

  factory Store.fromJson(Map<String, dynamic> json) => _$StoreFromJson(json);
  Map<String, dynamic> toJson() => _$StoreToJson(this);
}

// Brand model (simplified - would be expanded based on actual API)
@freeze
class Brand with _$Brand {
  const Brand({required this.id, required this.name, required this.logoUrl});

  final String id;
  final String name;
  final String logoUrl;

  factory Brand.fromJson(Map<String, dynamic> json) => _$BrandFromJson(json);
  Map<String, dynamic> toJson() => _$BrandToJson(this);
}
