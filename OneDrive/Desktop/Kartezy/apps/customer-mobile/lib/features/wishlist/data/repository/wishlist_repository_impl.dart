// lib/features/wishlist/data/repository/wishlist_repository_impl.dart
import 'package:customer_mobile/features/wishlist/data/datasource/wishlist_remote_data_source.dart';
import 'package:customer_mobile/features/wishlist/domain/repository/wishlist_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WishlistRepositoryImpl implements WishlistRepository {
  final WishlistRemoteDataSource _remoteDataSource;

  WishlistRepositoryImpl(this._remoteDataSource);

  @override
  Future<void> addToWishlist(String productId) async {
    await _remoteDataSource.addToWishlist(productId);
  }

  @override
  Future<void> removeFromWishlist(String productId) async {
    await _remoteDataSource.removeFromWishlist(productId);
  }

  @override
  Future<List<Product>> getWishlistItems() async {
    return await _remoteDataSource.getWishlistItems();
  }

  @override
  Future<bool> isInWishlist(String productId) async {
    return await _remoteDataSource.isInWishlist(productId);
  }
}

/// Provider for wishlist repository
final wishlistRepositoryProvider = Provider<WishlistRepository>((ref) {
  final remoteDataSource = ref.read(wishlistRemoteDataSourceProvider);
  return WishlistRepositoryImpl(remoteDataSource);
});
