// lib/features/categories/data/datasource/category_remote_data_source.dart
// Backend: CatalogService CategoryController exposes GET /categories
// returning List<CategoryDto> with Long id, code, name, description,
// imageUrl, parentId, sortOrder, isActive, createdAt, updatedAt.
// The Flutter Category model uses a String id, so we convert at this boundary.

import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/category.dart';

class CategoryRemoteDataSource {
  final Dio _dio;

  CategoryRemoteDataSource(this._dio);

  Future<List<Category>> getCategories() async {
    final response = await _dio.get('/categories');
    final List<dynamic> data = response.data is List
        ? response.data as List
        : (response.data['data'] as List? ??
              response.data['content'] as List? ??
              []);
    return data.map((json) {
      final map = Map<String, dynamic>.from(json as Map);
      // Backend CategoryDto uses Long id; convert to String for the Flutter model
      if (map['id'] is int || map['id'] is num) {
        map['id'] = map['id'].toString();
      }
      // Backend may use imageUrl or not; provide a fallback if missing
      map['imageUrl'] = map['imageUrl'] as String? ?? '';
      return Category.fromJson(map);
    }).toList();
  }
}
