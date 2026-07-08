// lib/features/categories/data/datasource/category_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/category.dart';
import 'package:customer_mobile/core/network/dio_client.dart';

class CategoryRemoteDataSource {
  final Dio _dio;

  CategoryRemoteDataSource(this._dio);

  Future<List<Category>> getCategories() async {
    final response = await _dio.get('/categories');
    final List<dynamic> data = response.data;
    return data
        .map((json) => Category.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
