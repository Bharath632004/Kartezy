import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:kartezy_core/services/mfa_service.dart';

/// Possible states during MFA flow.
enum MfaFlowState {
  idle,
  enrolling,
  verifying,
  verified,
  failed,
}

/// State notifier for MFA flow management.
class MfaNotifier extends StateNotifier<MfaState> {
  final Ref _ref;

  MfaNotifier(this._ref) : super(MfaState.initial());

  /// Initiate MFA enrollment.
  Future<MfaEnrollmentResult?> enroll(String deviceName) async {
    state = state.copyWith(flowState: MfaFlowState.enrolling);
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      final result = await mfaService.enroll(deviceName);
      state = state.copyWith(
        flowState: MfaFlowState.enrolling,
        enrollmentResult: result,
        error: null,
      );
      return result;
    } catch (e) {
      state = state.copyWith(
        flowState: MfaFlowState.failed,
        error: e.toString(),
      );
      return null;
    }
  }

  /// Verify TOTP code to complete enrollment.
  Future<bool> verify(String deviceId, String code) async {
    state = state.copyWith(flowState: MfaFlowState.verifying);
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      final success = await mfaService.verify(deviceId, code);
      if (success) {
        state = state.copyWith(
          flowState: MfaFlowState.verified,
          isMfaEnabled: true,
          error: null,
        );
      } else {
        state = state.copyWith(
          flowState: MfaFlowState.failed,
          error: 'Invalid verification code',
        );
      }
      return success;
    } catch (e) {
      state = state.copyWith(
        flowState: MfaFlowState.failed,
        error: e.toString(),
      );
      return false;
    }
  }

  /// Use a backup code.
  Future<bool> useBackupCode(String email, String code) async {
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      final success = await mfaService.useBackupCode(email, code);
      if (success) {
        state = state.copyWith(flowState: MfaFlowState.verified, error: null);
      } else {
        state = state.copyWith(error: 'Invalid backup code');
      }
      return success;
    } catch (e) {
      state = state.copyWith(error: e.toString());
      return false;
    }
  }

  /// Validate a TOTP code during login.
  Future<bool> validate(String code) async {
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      return await mfaService.validate(code);
    } catch (_) {
      return false;
    }
  }

  /// Disable MFA.
  Future<bool> disable() async {
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      final success = await mfaService.disable();
      if (success) {
        state = MfaState.initial();
      }
      return success;
    } catch (_) {
      return false;
    }
  }

  /// Refresh MFA status.
  Future<void> refreshStatus() async {
    try {
      final mfaService = _ref.read(mfaServiceProvider);
      final status = await mfaService.getStatus();
      state = state.copyWith(
        isMfaEnabled: status.mfaEnabled,
        isMfaVerified: status.mfaVerified,
        deviceCount: status.deviceCount,
        backupCodeCount: status.backupCodeCount,
      );
    } catch (_) {}
  }

  void reset() {
    state = MfaState.initial();
  }
}

/// MFA state.
class MfaState {
  final MfaFlowState flowState;
  final MfaEnrollmentResult? enrollmentResult;
  final bool isMfaEnabled;
  final bool isMfaVerified;
  final int deviceCount;
  final int backupCodeCount;
  final String? error;

  const MfaState({
    required this.flowState,
    this.enrollmentResult,
    required this.isMfaEnabled,
    required this.isMfaVerified,
    required this.deviceCount,
    required this.backupCodeCount,
    this.error,
  });

  factory MfaState.initial() => const MfaState(
        flowState: MfaFlowState.idle,
        isMfaEnabled: false,
        isMfaVerified: false,
        deviceCount: 0,
        backupCodeCount: 0,
      );

  MfaState copyWith({
    MfaFlowState? flowState,
    MfaEnrollmentResult? enrollmentResult,
    bool? isMfaEnabled,
    bool? isMfaVerified,
    int? deviceCount,
    int? backupCodeCount,
    String? error,
  }) {
    return MfaState(
      flowState: flowState ?? this.flowState,
      enrollmentResult: enrollmentResult ?? this.enrollmentResult,
      isMfaEnabled: isMfaEnabled ?? this.isMfaEnabled,
      isMfaVerified: isMfaVerified ?? this.isMfaVerified,
      deviceCount: deviceCount ?? this.deviceCount,
      backupCodeCount: backupCodeCount ?? this.backupCodeCount,
      error: error,
    );
  }
}

final mfaProvider = StateNotifierProvider<MfaNotifier, MfaState>((ref) {
  return MfaNotifier(ref);
});
