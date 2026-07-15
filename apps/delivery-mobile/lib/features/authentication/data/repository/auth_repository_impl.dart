// lib/features/authentication/data/repository/auth_repository_impl.dart
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:delivery_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:delivery_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:delivery_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Ref _ref;

  AuthRepositoryImpl(this._ref);

  @override
  Future<User> login(String email, String password) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.login(email, password);
      // Store user info or token
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
      // Store user in Hive for quick access
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.put('currentUser', user);
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
      // Note: We might not have a user yet, but the backend might return a temporary token or just success.
      // We'll store any tokens if present, but for OTP sending, we might not need to store user.
      // However, the backend might return a transaction ID or something. We'll adjust as needed.
      // For now, we'll just return the user (which might have a token for verification step).
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
      // Store user info or token
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
      // Store user in Hive for quick access
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
      // Clear tokens from secure storage
      final secureStorage = _ref.read(secureStorageProvider);
      await secureStorage.delete(key: 'accessToken');
      await secureStorage.delete(key: 'refreshToken');
      await secureStorage.delete(key: 'userId');
      // Clear user from Hive
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
      // Update stored tokens
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
      // Update user in Hive
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.put('currentUser', user);
      return user;
    } catch (e) {
      throw Exception('Failed to refresh token: $e');
    }
  }

  @override
  Future<User> register(
    String email,
    String password,
    Map<String, dynamic> profileData,
  ) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.register(
        email,
        password,
        profileData,
      );
      // Store user info or token
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
      // Store user in Hive for quick access
      final hiveManager = _ref.read(hiveManagerProvider);
      final userBox = hiveManager.getBox<User>(boxName: 'user');
      await userBox.put('currentUser', user);
      return user;
    } catch (e) {
      rethrow;
    }
  }
}
