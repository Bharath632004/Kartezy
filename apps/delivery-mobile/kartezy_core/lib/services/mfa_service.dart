import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/providers/network_provider.dart';

/// Service for Multi-Factor Authentication (MFA) operations.
/// Supports TOTP authenticator apps (Google Authenticator, Authy, etc.).
class MfaService {
  final Ref _ref;

  MfaService(this._ref);

  /// Enroll in MFA by generating a TOTP secret and provisioning URI.
  /// Returns deviceId, secret, provisioningUri, and backupCodes.
  Future<MfaEnrollmentResult> enroll(String deviceName) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post(
      '/auth/mfa/enroll',
      data: {'deviceName': deviceName},
    );
    return MfaEnrollmentResult.fromJson(response.data);
  }

  /// Verify a TOTP code to complete MFA enrollment.
  Future<bool> verify(String deviceId, String code) async {
    final dio = _ref.read(dioProvider);
    try {
      final response = await dio.post(
        '/auth/mfa/verify',
        data: {'deviceId': deviceId, 'code': code},
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Validate a TOTP code during login.
  Future<bool> validate(String code) async {
    final dio = _ref.read(dioProvider);
    try {
      final response = await dio.post(
        '/auth/mfa/validate',
        data: {'code': code},
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Use a backup code to bypass MFA.
  Future<bool> useBackupCode(String email, String backupCode) async {
    final dio = _ref.read(dioProvider);
    try {
      final response = await dio.post(
        '/auth/mfa/backup-code?email=$email',
        data: {'backupCode': backupCode},
      );
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Get current MFA status.
  Future<MfaStatus> getStatus() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/auth/mfa/status');
    return MfaStatus.fromJson(response.data);
  }

  /// Disable MFA for the current user.
  Future<bool> disable() async {
    final dio = _ref.read(dioProvider);
    try {
      final response = await dio.post('/auth/mfa/disable');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Regenerate backup codes.
  Future<List<String>> regenerateBackupCodes() async {
    final dio = _ref.read(dioProvider);
    final response = await dio.post('/auth/mfa/regenerate-backup-codes');
    final data = response.data as Map<String, dynamic>;
    final codes = data['backupCodes'] as List<dynamic>;
    return codes.map((c) => c['code'] as String).toList();
  }
}

/// Result of MFA enrollment.
class MfaEnrollmentResult {
  final String deviceId;
  final String secret;
  final String provisioningUri;
  final List<MfaBackupCode> backupCodes;

  MfaEnrollmentResult({
    required this.deviceId,
    required this.secret,
    required this.provisioningUri,
    required this.backupCodes,
  });

  factory MfaEnrollmentResult.fromJson(Map<String, dynamic> json) {
    return MfaEnrollmentResult(
      deviceId: json['deviceId'] as String,
      secret: json['secret'] as String,
      provisioningUri: json['provisioningUri'] as String,
      backupCodes: (json['backupCodes'] as List<dynamic>)
          .map((c) => MfaBackupCode.fromJson(c as Map<String, dynamic>))
          .toList(),
    );
  }
}

class MfaBackupCode {
  final String code;
  final bool used;

  MfaBackupCode({required this.code, required this.used});

  factory MfaBackupCode.fromJson(Map<String, dynamic> json) {
    return MfaBackupCode(
      code: json['code'] as String,
      used: json['used'] as bool,
    );
  }
}

class MfaStatus {
  final bool mfaEnabled;
  final bool mfaVerified;
  final int deviceCount;
  final int backupCodeCount;

  MfaStatus({
    required this.mfaEnabled,
    required this.mfaVerified,
    required this.deviceCount,
    required this.backupCodeCount,
  });

  factory MfaStatus.fromJson(Map<String, dynamic> json) {
    return MfaStatus(
      mfaEnabled: json['mfaEnabled'] as bool? ?? json['mfa_enabled'] as bool? ?? false,
      mfaVerified: json['mfaVerified'] as bool? ?? json['mfa_verified'] as bool? ?? false,
      deviceCount: json['deviceCount'] as int? ?? json['device_count'] as int? ?? 0,
      backupCodeCount: json['backupCodeCount'] as int? ?? json['backup_code_count'] as int? ?? 0,
    );
  }
}

/// Provider for MfaService
final mfaServiceProvider = Provider<MfaService>((ref) {
  return MfaService(ref);
});
