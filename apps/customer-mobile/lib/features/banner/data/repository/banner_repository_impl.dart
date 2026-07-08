// lib/features/banner/data/repository/banner_repository_impl.dart
import 'package:customer_mobile/features/banner/data/datasource/banner_remote_data_source.dart';
import 'package:customer_mobile/features/banner/domain/repository/banner_repository.dart';
import 'package:customer_mobile/shared/models/banner.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BannerRepositoryImpl implements BannerRepository {
  final BannerRemoteDataSource _remoteDataSource;

  BannerRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Banner>> getBanners() async {
    return await _remoteDataSource.getBanners();
  }
}

/// Provider for banner repository
final bannerRepositoryProvider = Provider<BannerRepository>((ref) {
  final remoteDataSource = ref.read(bannerRemoteDataSourceProvider);
  return BannerRepositoryImpl(remoteDataSource);
});
