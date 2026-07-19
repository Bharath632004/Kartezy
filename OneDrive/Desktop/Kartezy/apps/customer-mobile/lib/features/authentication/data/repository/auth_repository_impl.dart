// lib/features/authentication/data/repository/auth_repository_impl.dart
// Auth repository implementation for customer-mobile with shared token management
import 'package:customer_mobile/core/storage/secure_storage.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Ref _ref;

  AuthRepositoryImpl(this._ref);

  /// Store authentication tokens in secure storage
  Future<void> _storeAuthTokens({
    required String userId,
    required String accessToken,
    required String refreshToken,
  }) async {
    final secureStorage = _ref.read(secureStorageProvider);
    await Future.wait([
      secureStorage.write(key: 'userId', value: userId),
      secureStorage.write(key: 'accessToken', value: accessToken),
      secureStorage.write(key: 'refreshToken', value: refreshToken),
    ]);
  }

  /// Store user data in Hive for quick access
  Future<void> _storeUserData(User user) async {
    final hiveManager = _ref.read(hiveManagerProvider);
    final userBox = hiveManager.getBox<User>(boxName: 'user');
    await userBox.put('currentUser', user);
  }

  /// Validate that tokens are present
  void _validateTokens(String? accessToken, String? refreshToken) {
    if (accessToken == null) throw Exception('Access token is null');
    if (refreshToken == null) throw Exception('Refresh token is null');
  }

  /// Persist auth data after successful authentication
  Future<void> _persistAuth(User user) async {
    _validateTokens(user.accessToken, user.refreshToken);
    await _storeAuthTokens(
      userId: user.id.toString(),
      accessToken: user.accessToken!,
      refreshToken: user.refreshToken!,
    );
    await _storeUserData(user);
  }

  @override
  Future<User> login(String email, String password) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.login(email, password);
      await _persistAuth(user);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<User> sendOtp(String phoneNumber) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.sendOtp(phoneNumber);
      if (user.accessToken != null && user.accessToken!.isNotEmpty) {
        await _storeAuthTokens(
          userId: user.id.toString(),
          accessToken: user.accessToken!,
          refreshToken: user.refreshToken ?? '',
        );
      }
      return user;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<User> verifyOtp(String phoneNumber, String otp) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.verifyOtp(phoneNumber, otp);
      await _persistAuth(user);
      return user;
    } catch (e) {
      rethrow;
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
      final secureStorage = _ref.read(secureStorageProvider);
      await Future.wait([
        secureStorage.delete(key: 'accessToken'),
        secureStorage.delete(key: 'refreshToken'),
        secureStorage.delete(key: 'userId'),
      ]);
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.delete('currentUser');
    }
  }

  @override
  Future<String?> getCurrentUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }

  @override
  Future<User> refreshToken(String refreshToken) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.refreshToken(refreshToken);
      await _persistAuth(user);
      return user;
    } catch (e) {
      throw Exception('Failed to refresh token: $e');
    }
  }
}
