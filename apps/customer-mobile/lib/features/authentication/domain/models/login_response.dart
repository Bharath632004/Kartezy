// lib/features/authentication/domain/models/login_response.dart
import 'package:customer_mobile/shared/models/user.dart';

/// Response from the login API that may include MFA requirements.
class LoginResponse {
  final User? user;
  final String? accessToken;
  final String? refreshToken;
  final bool mfaRequired;
  final String? mfaSessionToken;
  final String? email;

  const LoginResponse({
    this.user,
    this.accessToken,
    this.refreshToken,
    this.mfaRequired = false,
    this.mfaSessionToken,
    this.email,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    final mfaRequired =
        json['mfaRequired'] == true || json['mfa_required'] == true;

    if (mfaRequired) {
      return LoginResponse(
        mfaRequired: true,
        mfaSessionToken:
            json['mfaSessionToken'] as String? ??
            json['mfa_session_token'] as String?,
        email: json['email'] as String?,
      );
    }

    return LoginResponse(
      user: json.containsKey('id') || json.containsKey('user')
          ? User.fromJson(json['user'] as Map<String, dynamic>? ?? json)
          : null,
      accessToken:
          json['accessToken'] as String? ?? json['access_token'] as String?,
      refreshToken:
          json['refreshToken'] as String? ?? json['refresh_token'] as String?,
      email: json['email'] as String?,
    );
  }
}

/// Exception thrown when MFA verification is required after login.
class MfaRequiredException implements Exception {
  final String email;
  final String mfaSessionToken;

  const MfaRequiredException({
    required this.email,
    required this.mfaSessionToken,
  });

  @override
  String toString() => 'MFA verification required for $email';
}
