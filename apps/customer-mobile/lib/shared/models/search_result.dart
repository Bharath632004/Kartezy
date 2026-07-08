import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/shared/models/store.dart';
import 'package:customer_mobile/shared/models/brand.dart';
import 'package:customer_mobile/shared/models/category.dart';

part 'search_result.freezed.dart';
part 'search_result.g.dart';

@freezed
class SearchResult with _$SearchResult {
  const factory SearchResult({
    required this.products,
    required this.stores,
    required this.brands,
    required this.categories,
    required this.totalResults,
    required this.suggestions,
    this.facets,
  }) = _SearchResult;

  final List<Product> products;
  final List<Store> stores;
  final List<Brand> brands;
  final List<Category> categories;
  final int totalResults;
  final List<String> suggestions;
  final Map<String, dynamic>? facets;

  factory SearchResult.fromJson(Map<String, dynamic> json) =>
      _$SearchResultFromJson(json);
}
