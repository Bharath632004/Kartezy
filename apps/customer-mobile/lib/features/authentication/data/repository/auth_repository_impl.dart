// lib/features/authentication/data/repository/auth_repository_impl.dart
import 'package:customer_mobile/core/storage/secure_storage.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/domain/models/login_response.dart';
import 'package:customer_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Ref _ref;

  AuthRepositoryImpl(this._ref);

  @override
  Future<LoginResponse> login(String email, String password) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final loginResponse = await remoteDataSource.login(email, password);

      // If MFA is required, return early without saving tokens
      if (loginResponse.mfaRequired) {
        return loginResponse;
      }

      // Store user info or token
      final user = loginResponse.user;
      final secureStorage = _ref.read(secureStorageProvider);
      if (loginResponse.accessToken == null) {
        throw Exception('Access token is null');
      }
      if (loginResponse.refreshToken == null) {
        throw Exception('Refresh token is null');
      }
      final accessToken = loginResponse.accessToken!;
      final refreshToken = loginResponse.refreshToken!;
      if (user != null) {
        await secureStorage.write(key: 'userId', value: user.id.toString());
      }
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'refreshToken', value: refreshToken);
      // Store user in Hive for quick access
      if (user != null) {
        final hiveManager = _ref.read(hiveManagerProvider);
        final userBox = hiveManager.getBox<User>(boxName: 'user');
        await userBox.put('currentUser', user);
      }
      return loginResponse;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<User> sendOtp(String phoneNumber) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.sendOtp(phoneNumber);
      final secureStorage = _ref.read(secureStorageProvider);
      if (user.accessToken != null && user.accessToken!.isNotEmpty) {
        final accessToken = user.accessToken!;
        await secureStorage.write(key: 'accessToken', value: accessToken);
        if (user.refreshToken != null && user.refreshToken!.isNotEmpty) {
          await secureStorage.write(
            key: 'refreshToken',
            value: user.refreshToken!,
          );
        }
        await secureStorage.write(key: 'userId', value: user.id.toString());
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
      final secureStorage = _ref.read(secureStorageProvider);
      if (user.accessToken == null) {
        throw Exception('Access token is null');
      }
      if (user.refreshToken == null) {
        throw Exception('Refresh token is null');
      }
      final accessToken = user.accessToken!;
      final refreshToken = user.refreshToken!;
      await secureStorage.write(key: 'userId', value: user.id.toString());
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'refreshToken', value: refreshToken);
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.put('currentUser', user);
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
      await secureStorage.delete(key: 'accessToken');
      await secureStorage.delete(key: 'refreshToken');
      await secureStorage.delete(key: 'userId');
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
      final secureStorage = _ref.read(secureStorageProvider);
      if (user.accessToken == null) {
        throw Exception('Access token is null');
      }
      if (user.refreshToken == null) {
        throw Exception('Refresh token is null');
      }
      final accessToken = user.accessToken!;
      final refreshTokenValue = user.refreshToken!;
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'refreshToken', value: refreshTokenValue);
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.put('currentUser', user);
      return user;
    } catch (e) {
      throw Exception('Failed to refresh token: $e');
    }
  }
}
