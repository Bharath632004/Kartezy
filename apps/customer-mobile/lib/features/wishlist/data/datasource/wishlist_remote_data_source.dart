// lib/features/wishlist/data/datasource/wishlist_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class WishlistRemoteDataSource {
  Future<List<Product>> getWishlistItems();
  Future<void> addToWishlist(String productId);
  Future<void> removeFromWishlist(String productId);
  Future<bool> isInWishlist(String productId);
  Future<void> clearWishlist();
}

class WishlistRemoteDataSourceImpl implements WishlistRemoteDataSource {
  final Ref _ref;

  WishlistRemoteDataSourceImpl(this._ref);

  @override
  Future<List<Product>> getWishlistItems() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/wishlist');
    final List<dynamic> data = response.data['items'] ?? [];
    return data.map((json) => Product.fromJson(json)).toList();
  }

  @override
  Future<void> addToWishlist(String productId) async {
    final dio = _ref.read(dioProvider);
    await dio.post('/wishlist/add', data: {'productId': productId});
  }

  @override
  Future<void> removeFromWishlist(String productId) async {
    final dio = _ref.read(dioProvider);
    await dio.post('/wishlist/remove', data: {'productId': productId});
  }

  @override
  Future<bool> isInWishlist(String productId) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/wishlist/check/$productId');
    return response.data['inWishlist'] ?? false;
  }

  @override
  Future<void> clearWishlist() async {
    final dio = _ref.read(dioProvider);
    await dio.delete('/wishlist/clear');
  }
}

/// Provider for wishlist remote data source
final wishlistRemoteDataSourceProvider = Provider<WishlistRemoteDataSource>((
  ref,
) {
  return WishlistRemoteDataSourceImpl(ref);
});
