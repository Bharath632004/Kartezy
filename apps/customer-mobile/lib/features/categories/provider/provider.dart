// lib/features/categories/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/categories/data/datasource/category_remote_data_source.dart';
import 'package:customer_mobile/features/categories/data/repository/category_repository_impl.dart';
import 'package:customer_mobile/features/categories/domain/repository/category_repository.dart';
import 'package:customer_mobile/features/categories/domain/usecase/get_categories_usecase.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:customer_mobile/shared/models/category.dart';

// Provider for category remote data source
final categoryRemoteDataSourceProvider = Provider<CategoryRemoteDataSource>((
  ref,
) {
  final dio = ref.read(dioProvider);
  return CategoryRemoteDataSource(dio);
});

// Provider for category repository
final categoryRepositoryProvider = Provider<CategoryRepository>((ref) {
  final remoteDataSource = ref.read(categoryRemoteDataSourceProvider);
  return CategoryRepositoryImpl(remoteDataSource);
});

// Provider for get categories use case
final getCategoriesUseCaseProvider = Provider<GetCategoriesUseCase>((ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return GetCategoriesUseCase(repository);
});

/// FutureProvider that fetches the list of categories from the backend.
/// Pages should watch this provider to get categories with loading/error states.
final categoriesProvider = FutureProvider<List<Category>>((ref) async {
  final useCase = ref.read(getCategoriesUseCaseProvider);
  return useCase.call();
});
