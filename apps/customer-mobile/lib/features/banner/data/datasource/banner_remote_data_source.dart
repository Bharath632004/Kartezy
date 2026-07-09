// lib/features/banner/data/datasource/banner_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/banner.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

class BannerRemoteDataSource {
  final Dio _dio;

  BannerRemoteDataSource(this._dio);

  Future<List<Banner>> getBanners() async {
    final response = await _dio.get('/banners');
    final List<dynamic> data = response.data;
    return data
        .map((json) => Banner.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}

/// Provider for banner remote data source
final bannerRemoteDataSourceProvider = Provider<BannerRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return BannerRemoteDataSource(dio);
});