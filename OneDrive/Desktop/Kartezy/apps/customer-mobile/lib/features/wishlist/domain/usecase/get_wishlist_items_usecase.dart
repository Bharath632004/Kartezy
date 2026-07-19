// lib/features/wishlist/domain/usecase/get_wishlist_items_usecase.dart
import 'package:customer_mobile/features/wishlist/domain/repository/wishlist_repository.dart';
import 'package:customer_mobile/features/wishlist/data/repository/wishlist_repository_impl.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetWishlistItemsUseCase {
  final WishlistRepository _repository;

  GetWishlistItemsUseCase(this._repository);

  Future<List<Product>> call() {
    return _repository.getWishlistItems();
  }
}

/// Provider for get wishlist items use case
final getWishlistItemsUseCaseProvider = Provider<GetWishlistItemsUseCase>((
  ref,
) {
  final repository = ref.read(wishlistRepositoryProvider);
  return GetWishlistItemsUseCase(repository);
});
