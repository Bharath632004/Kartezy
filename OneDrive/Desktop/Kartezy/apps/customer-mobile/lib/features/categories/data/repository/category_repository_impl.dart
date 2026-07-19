// lib/features/categories/data/repository/category_repository_impl.dart
import 'package:customer_mobile/features/categories/domain/repository/category_repository.dart';
import 'package:customer_mobile/features/categories/data/datasource/category_remote_data_source.dart';
import 'package:customer_mobile/shared/models/category.dart';

class CategoryRepositoryImpl implements CategoryRepository {
  final CategoryRemoteDataSource _remoteDataSource;

  CategoryRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Category>> getCategories() async {
    return await _remoteDataSource.getCategories();
  }
}
