// lib/features/wishlist/domain/usecase/remove_from_wishlist_usecase.dart
import 'package:customer_mobile/features/wishlist/domain/repository/wishlist_repository.dart';
import 'package:customer_mobile/features/wishlist/data/repository/wishlist_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RemoveFromWishlistUseCase {
  final WishlistRepository _repository;

  RemoveFromWishlistUseCase(this._repository);

  Future<void> call(String productId) {
    return _repository.removeFromWishlist(productId);
  }
}

/// Provider for remove from wishlist use case
final removeFromWishlistUseCaseProvider = Provider<RemoveFromWishlistUseCase>((ref) {
  final repository = ref.read(wishlistRepositoryProvider);
  return RemoveFromWishlistUseCase(repository);
});