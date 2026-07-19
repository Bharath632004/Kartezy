// lib/core/storage/secure_storage.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure storage for sensitive data like tokens, passwords, etc.
class SecureStorage {
  SecureStorage._internal();

  static final SecureStorage _instance = SecureStorage._internal();

  factory SecureStorage() => _instance;

  final _storage = const FlutterSecureStorage();

  /// Write a value to secure storage.
  Future<void> write({required String key, required String value}) async {
    await _storage.write(key: key, value: value);
  }

  /// Read a value from secure storage.
  Future<String?> read({required String key}) async {
    return await _storage.read(key: key);
  }

  /// Delete a value from secure storage.
  Future<void> delete({required String key}) async {
    await _storage.delete(key: key);
  }

  /// Delete all values in secure storage.
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }

  /// Check if a key exists in secure storage.
  Future<bool> containsKey({required String key}) async {
    return await _storage.containsKey(key: key);
  }
}

/// Provider for secure storage
final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});
