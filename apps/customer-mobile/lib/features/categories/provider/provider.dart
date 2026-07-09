// lib/features/categories/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/categories/data/datasource/category_remote_data_source.dart';
import 'package:customer_mobile/features/categories/data/repository/category_repository_impl.dart';
import 'package:customer_mobile/features/categories/domain/repository/category_repository.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

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
