// lib/features/authentication/data/repository/auth_repository_impl.dart
// Refactored to use shared BaseAuthRepositoryImpl from kartezy_core
import 'package:kartezy_core/services/base_auth_repository.dart';
import 'package:delivery_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:delivery_mobile/features/authentication/data/datasource/auth_remote_data_source.dart';
import 'package:delivery_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Ref _ref;

  BaseAuthRepositoryImpl get _base => _ref.read(baseAuthRepositoryProvider);

  AuthRepositoryImpl(this._ref);

  @override
  Future<User> login(String email, String password) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.login(email, password);
      _base.validateTokens(user.accessToken, user.refreshToken);
      await _base.storeAuthTokens(
        userId: user.id.toString(),
        accessToken: user.accessToken!,
        refreshToken: user.refreshToken!,
      );
      await _base.storeUserData<User>(
        boxName: 'user',
        key: 'currentUser',
        data: user,
      );
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
        await _base.storeAuthTokens(
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
      _base.validateTokens(user.accessToken, user.refreshToken);
      await _base.storeAuthTokens(
        userId: user.id.toString(),
        accessToken: user.accessToken!,
        refreshToken: user.refreshToken!,
      );
      await _base.storeUserData<User>(
        boxName: 'user',
        key: 'currentUser',
        data: user,
      );
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
      await _base.clearAuthData();
    }
  }

  @override
  Future<String?> getCurrentUserId() async {
    return _base.getCurrentUserId();
  }

  @override
  Future<User> refreshToken(String refreshToken) async {
    try {
      final remoteDataSource = _ref.read(authRemoteDataSourceProvider);
      final user = await remoteDataSource.refreshToken(refreshToken);
      _base.validateTokens(user.accessToken, user.refreshToken);
      await _base.storeAuthTokens(
        userId: user.id.toString(),
        accessToken: user.accessToken!,
        refreshToken: user.refreshToken!,
      );
      await _base.storeUserData<User>(
        boxName: 'user',
        key: 'currentUser',
        data: user,
      );
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
      final user = await remoteDataSource.register(email, password, profileData);
      _base.validateTokens(user.accessToken, user.refreshToken);
      await _base.storeAuthTokens(
        userId: user.id.toString(),
        accessToken: user.accessToken!,
        refreshToken: user.refreshToken!,
      );
      await _base.storeUserData<User>(
        boxName: 'user',
        key: 'currentUser',
        data: user,
      );
      return user;
    } catch (e) {
      rethrow;
    }
  }
}
