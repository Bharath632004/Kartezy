// lib/features/categories/data/repository/category_repository_impl.dart
import 'package:customer_mobile/features/categories/domain/repository/category_repository.dart';
import 'package:customer_mobile/features/categories/data/datasource/category_remote_data_source.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CategoryRepositoryImpl implements CategoryRepository {
  final CategoryRemoteDataSource _remoteDataSource;

  CategoryRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Category>> getCategories() async {
    return await _remoteDataSource.getCategories();
  }
}

/// Provider for category repository
final categoryRepositoryProvider = Provider<CategoryRepository>((ref) {
  final remoteDataSource = ref.read(categoryRemoteDataSourceProvider);
  return CategoryRepositoryImpl(remoteDataSource);
});