// lib/features/authentication/data/repository/auth_repository_impl.dart
import 'package:customer_mobile/core/storage/secure_storage.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Ref _ref;

  AuthRepositoryImpl(this._ref);

  @override
  Future<bool> login(String email, String password) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.login(email, password);
      // Store user info or token
      final secureStorage = _ref.read(secureStorageProvider);
      await secureStorage.write(key: 'userId', value: user.id.toString());
      await secureStorage.write(key: 'accessToken', value: user.accessToken);
      await secureStorage.write(key: 'refreshToken', value: user.refreshToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> logout() async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      await remoteDataSource.logout();
    } catch (_) {
      // Ignore errors on logout
    } finally {
      // Clear tokens from secure storage
      final secureStorage = _ref.read(secureStorageProvider);
      await secureStorage.delete(key: 'accessToken');
      await secureStorage.delete(key: 'refreshToken');
      await secureStorage.delete(key: 'userId');
    }
  }

  @override
  Future<String?> getCurrentUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }
}

/// Provider for auth repository
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(ref);
});