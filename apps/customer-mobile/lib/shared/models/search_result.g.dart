// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchResult _$SearchResultFromJson(Map<String, dynamic> json) => SearchResult(
  products: (json['products'] as List<dynamic>)
      .map((e) => Product.fromJson(e as Map<String, dynamic>))
      .toList(),
  stores: (json['stores'] as List<dynamic>)
      .map((e) => Store.fromJson(e as Map<String, dynamic>))
      .toList(),
  brands: (json['brands'] as List<dynamic>)
      .map((e) => Brand.fromJson(e as Map<String, dynamic>))
      .toList(),
  categories: (json['categories'] as List<dynamic>)
      .map((e) => Category.fromJson(e as Map<String, dynamic>))
      .toList(),
  totalResults: (json['totalResults'] as num).toInt(),
  suggestions: (json['suggestions'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  facets: json['facets'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$SearchResultToJson(SearchResult instance) =>
    <String, dynamic>{
      'products': instance.products,
      'stores': instance.stores,
      'brands': instance.brands,
      'categories': instance.categories,
      'totalResults': instance.totalResults,
      'suggestions': instance.suggestions,
      'facets': instance.facets,
    };

_$SearchResultImpl _$$SearchResultImplFromJson(Map<String, dynamic> json) =>
    _$SearchResultImpl(
      products: (json['products'] as List<dynamic>)
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
      stores: (json['stores'] as List<dynamic>)
          .map((e) => Store.fromJson(e as Map<String, dynamic>))
          .toList(),
      brands: (json['brands'] as List<dynamic>)
          .map((e) => Brand.fromJson(e as Map<String, dynamic>))
          .toList(),
      categories: (json['categories'] as List<dynamic>)
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalResults: (json['totalResults'] as num).toInt(),
      suggestions: (json['suggestions'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      facets: json['facets'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$$SearchResultImplToJson(_$SearchResultImpl instance) =>
    <String, dynamic>{
      'products': instance.products,
      'stores': instance.stores,
      'brands': instance.brands,
      'categories': instance.categories,
      'totalResults': instance.totalResults,
      'suggestions': instance.suggestions,
      'facets': instance.facets,
    };
