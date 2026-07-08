// lib/features/wishlist/domain/repository/wishlist_repository.dart
import 'package:customer_mobile/shared/models/product.dart';

abstract class WishlistRepository {
  Future<void> addToWishlist(String productId);
  Future<void> removeFromWishlist(String productId);
  Future<List<Product>> getWishlistItems();
  Future<bool> isInWishlist(String productId);
}
