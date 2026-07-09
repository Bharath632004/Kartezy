// lib/features/products/data/datasource/product_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductRemoteDataSource {
  final Dio _dio;

  ProductRemoteDataSource(this._dio);

  Future<List<Product>> getProductsByFilter(String filter) async {
    final response = await _dio.get(
      '/products',
      queryParameters: {
        'filter': filter,
        'limit': 20, // default limit
      },
    );
    final List<dynamic> data = response.data;
    return data
        .map((json) => Product.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}

/// Provider for product remote data source
final productRemoteDataSourceProvider = Provider<ProductRemoteDataSource>((
  ref,
) {
  final dio = ref.read(dioProvider);
  return ProductRemoteDataSource(dio);
});
