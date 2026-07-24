// lib/features/mfa/provider/mfa_provider.dart
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

/// Service for MFA operations.
class MfaService {
  final Dio _dio;

  MfaService(this._dio);

  /// Enroll in MFA by generating a TOTP secret.
  Future<Map<String, dynamic>> enroll(String deviceName) async {
    final response = await _dio.post(
      '/auth/mfa/enroll',
      data: {'deviceName': deviceName},
    );
    return response.data as Map<String, dynamic>;
  }

  /// Verify a TOTP code to complete enrollment.
  Future<bool> verify(String deviceId, String code) async {
    try {
      final response = await _dio.post(
        '/auth/mfa/verify',
        data: {'deviceId': deviceId, 'code': code},
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Validate a TOTP code during login with MFA session token.
  Future<Map<String, dynamic>?> validate(String code, {String? mfaSessionToken}) async {
    try {
      final response = await _dio.post(
        '/auth/mfa/validate',
        data: {
          'code': code,
          if (mfaSessionToken != null) 'mfaSessionToken': mfaSessionToken,
        },
      );
      return response.data as Map<String, dynamic>?;
    } catch (_) {
      return null;
    }
  }

  /// Use a backup code to bypass MFA.
  Future<Map<String, dynamic>?> useBackupCode(String email, String backupCode) async {
    try {
      final response = await _dio.post(
        '/auth/mfa/backup-code',
        data: {'email': email, 'backupCode': backupCode},
      );
      return response.data as Map<String, dynamic>?;
    } catch (_) {
      return null;
    }
  }

  /// Get current MFA status.
  Future<Map<String, dynamic>> getStatus() async {
    final response = await _dio.get('/auth/mfa/status');
    return response.data as Map<String, dynamic>;
  }

  /// Disable MFA.
  Future<bool> disable() async {
    try {
      final response = await _dio.post('/auth/mfa/disable');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Regenerate backup codes.
  Future<List<String>> regenerateBackupCodes() async {
    final response = await _dio.post('/auth/mfa/regenerate-backup-codes');
    final data = response.data as Map<String, dynamic>;
    final codes = data['backupCodes'] as List<dynamic>;
    return codes.map((c) => c['code'] as String).toList();
  }
}

final mfaServiceProvider = Provider<MfaService>((ref) {
  final dio = ref.read(dioProvider);
  return MfaService(dio);
});
