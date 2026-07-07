// lib/features/authentication/data/datasource/auth_remote_data_source.dart
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login(String email, String password);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Ref _ref;

  AuthRemoteDataSourceImpl(this._ref);

  @override
  Future<Map<String, dynamic>> login(String email, String password) async {
    final dio = _read(dioProvider);
    final response = await dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  @override
  Future<void> logout() async {
    final dio = _read(dioProvider);
    await dio.post('/auth/logout');
  }
}

/// Provider for auth remote data source
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSourceImpl(ref);
});