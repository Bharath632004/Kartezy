// lib/features/wishlist/domain/usecase/add_to_wishlist_usecase.dart
import 'package:customer_mobile/features/wishlist/domain/repository/wishlist_repository.dart';
import 'package:customer_mobile/features/wishlist/data/repository/wishlist_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AddToWishlistUseCase {
  final WishlistRepository _repository;

  AddToWishlistUseCase(this._repository);

  Future<void> call(String productId) {
    return _repository.addToWishlist(productId);
  }
}

/// Provider for add to wishlist use case
final addToWishlistUseCaseProvider = Provider<AddToWishlistUseCase>((ref) {
  final repository = ref.read(wishlistRepositoryProvider);
  return AddToWishlistUseCase(repository);
});
