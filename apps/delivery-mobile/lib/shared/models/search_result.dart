import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:delivery_mobile/shared/models/product.dart';
import 'package:delivery_mobile/shared/models/store.dart';
import 'package:delivery_mobile/shared/models/brand.dart';
import 'package:delivery_mobile/shared/models/category.dart';

part 'search_result.freezed.dart';
part 'search_result.g.dart';

@freezed
class SearchResult with _$SearchResult {
  const factory SearchResult({
    required List<Product> products,
    required List<Store> stores,
    required List<Brand> brands,
    required List<Category> categories,
    required List<String> suggestions,
    required Map<String, dynamic>? facets,
    required int totalResults,
  }) = _SearchResult;

  factory SearchResult.fromJson(Map<String, dynamic> json) =>
      _$SearchResultFromJson(json);
}
