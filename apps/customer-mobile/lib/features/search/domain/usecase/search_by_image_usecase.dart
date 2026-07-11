// lib/features/search/domain/usecase/search_by_image_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class SearchByImageUseCase {
  final SearchRepository _repository;

  SearchByImageUseCase(this._repository);

  Future<List<Product>> call(String imagePath) {
    return _repository.searchByImage(imagePath);
  }
}

/// Provider for search by image use case
final searchByImageUseCaseProvider = Provider<SearchByImageUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchByImageUseCase(repository);
});
