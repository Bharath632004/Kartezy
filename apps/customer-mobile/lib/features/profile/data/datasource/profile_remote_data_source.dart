// lib/features/profile/data/datasource/profile_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProfileRemoteDataSource {
  final Dio _dio;

  ProfileRemoteDataSource(this._dio);

  Future<User> getProfile() async {
    final response = await _dio.get('/profile');
    return User.fromJson(response.data as Map<String, dynamic>);
  }
}

/// Provider for profile remote data source
final profileRemoteDataSourceProvider = Provider<ProfileRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return ProfileRemoteDataSource(dio);
});
