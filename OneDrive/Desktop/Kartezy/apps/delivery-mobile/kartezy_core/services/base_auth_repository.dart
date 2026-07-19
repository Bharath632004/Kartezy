// kartezy_core/services/base_auth_repository.dart
// Shared base repository for authentication logic across customer-mobile and delivery-mobile apps.
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:kartezy_core/storage/hive_manager.dart';
import 'package:kartezy_core/error/failures.dart';
import '../usecases/usecase.dart';

/// Abstract auth token storage operations that can be shared across apps
abstract class BaseAuthRepository {
  /// Store authentication tokens after successful login/OTP verification
  Future<void> storeAuthTokens({
    required String userId,
    required String accessToken,
    required String refreshToken,
  });

  /// Store user data in local storage
  Future<void> storeUserData<T>({required String boxName, required String key, required T data});

  /// Clear all auth data on logout
  Future<void> clearAuthData();

  /// Get current user ID from secure storage
  Future<String?> getCurrentUserId();

  /// Validate that tokens are not null before proceeding
  void validateTokens(String? accessToken, String? refreshToken);
}

/// Shared implementation of auth token and user data management
/// Used by both customer-mobile and delivery-mobile AuthRepositoryImpl classes
/// to eliminate duplicate token storage logic.
class BaseAuthRepositoryImpl implements BaseAuthRepository {
  final Ref _ref;

  BaseAuthRepositoryImpl(this._ref);

  @override
  Future<void> storeAuthTokens({
    required String userId,
    required String accessToken,
    required String refreshToken,
  }) async {
    validateTokens(accessToken, refreshToken);
    final secureStorage = _ref.read(secureStorageProvider);
    await Future.wait([
      secureStorage.write(key: 'userId', value: userId),
      secureStorage.write(key: 'accessToken', value: accessToken),
      secureStorage.write(key: 'refreshToken', value: refreshToken),
    ]);
  }

  @override
  Future<void> storeUserData<T>({
    required String boxName,
    required String key,
    required T data,
  }) async {
    final hiveManager = _ref.read(hiveManagerProvider);
    final box = hiveManager.getBox<T>(boxName: boxName);
    await box.put(key, data);
  }

  @override
  Future<void> clearAuthData() async {
    final secureStorage = _ref.read(secureStorageProvider);
    await Future.wait([
      secureStorage.delete(key: 'accessToken'),
      secureStorage.delete(key: 'refreshToken'),
      secureStorage.delete(key: 'userId'),
    ]);
    final hiveManager = _ref.read(hiveManagerProvider);
    final userBox = hiveManager.getBox<dynamic>(boxName: 'user');
    await userBox.delete('currentUser');
  }

  @override
  Future<String?> getCurrentUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }

  @override
  void validateTokens(String? accessToken, String? refreshToken) {
    if (accessToken == null) throw Exception('Access token is null');
    if (refreshToken == null) throw Exception('Refresh token is null');
  }
}

/// Provider for BaseAuthRepositoryImpl
final baseAuthRepositoryProvider = Provider<BaseAuthRepositoryImpl>((ref) {
  return BaseAuthRepositoryImpl(ref);
});
