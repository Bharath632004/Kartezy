// lib/features/mfa/presentation/mfa_verification_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/core/services/auth_service.dart';
import 'package:customer_mobile/features/mfa/provider/mfa_provider.dart';

/// Page for entering a 6-digit TOTP code from an authenticator app during login.
class MfaVerificationPage extends ConsumerStatefulWidget {
  final String email;
  final String mfaSessionToken;

  const MfaVerificationPage({
    super.key,
    required this.email,
    required this.mfaSessionToken,
  });

  @override
  ConsumerState<MfaVerificationPage> createState() =>
      _MfaVerificationPageState();
}

class _MfaVerificationPageState extends ConsumerState<MfaVerificationPage> {
  final _codeController = TextEditingController();
  final _backupCodeController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  bool _useBackupCode = false;

  @override
  void dispose() {
    _codeController.dispose();
    _backupCodeController.dispose();
    super.dispose();
  }

  Future<void> _verifyCode() async {
    final code = _codeController.text.trim();
    if (code.length != 6 || !RegExp(r'^\d{6}$').hasMatch(code)) {
      setState(() => _errorMessage = 'Please enter a valid 6-digit code');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final mfaService = ref.read(mfaServiceProvider);
      final result = await mfaService.validate(
        code,
        mfaSessionToken: widget.mfaSessionToken,
      );

      if (result != null && mounted) {
        // MFA validated - save tokens and navigate to home
        final authService = ref.read(authServiceProvider);
        await authService.saveTokens(
          accessToken:
              result['accessToken'] as String? ??
              result['access_token'] as String?,
          refreshToken:
              result['refreshToken'] as String? ??
              result['refresh_token'] as String?,
        );
        if (mounted) context.go('/home');
      } else if (mounted) {
        setState(() => _errorMessage = 'Invalid code. Please try again.');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = 'Verification failed: $e');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _useBackupCodeAction() async {
    final code = _backupCodeController.text.trim().replaceAll('-', '');
    if (code.isEmpty) {
      setState(() => _errorMessage = 'Please enter a backup code');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final mfaService = ref.read(mfaServiceProvider);
      final result = await mfaService.useBackupCode(widget.email, code);

      if (result != null && mounted) {
        final authService = ref.read(authServiceProvider);
        await authService.saveTokens(
          accessToken:
              result['accessToken'] as String? ??
              result['access_token'] as String?,
          refreshToken:
              result['refreshToken'] as String? ??
              result['refresh_token'] as String?,
        );
        if (mounted) context.go('/home');
      } else if (mounted) {
        setState(() => _errorMessage = 'Invalid or already used backup code.');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = 'Backup code failed: $e');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Two-Factor Authentication'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/login'),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 32),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.security,
                  size: 40,
                  color: theme.colorScheme.primary,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Two-Factor Authentication',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Enter the 6-digit code from your authenticator app.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 32),
              if (!_useBackupCode) ...[
                SizedBox(
                  width: size.width * 0.6,
                  child: TextField(
                    controller: _codeController,
                    textAlign: TextAlign.center,
                    maxLength: 6,
                    keyboardType: TextInputType.number,
                    style: theme.textTheme.headlineLarge?.copyWith(
                      letterSpacing: 12,
                      fontWeight: FontWeight.bold,
                    ),
                    decoration: InputDecoration(
                      counterText: '',
                      hintText: '------',
                      hintStyle: TextStyle(
                        letterSpacing: 12,
                        color: Colors.grey[300],
                        fontSize: 32,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _verifyCode,
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Verify', style: TextStyle(fontSize: 16)),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => setState(() {
                    _useBackupCode = true;
                    _errorMessage = null;
                  }),
                  child: const Text('Use a backup code instead'),
                ),
              ],
              if (_useBackupCode) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.orange.shade50,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.orange.shade200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.warning_amber, color: Colors.orange[700]),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Backup codes are single-use. Each code can only be used once.',
                          style: TextStyle(
                            color: Colors.orange[800],
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _backupCodeController,
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    hintText: 'XXXX-XXXXXXXX',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _useBackupCodeAction,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text(
                            'Verify Backup Code',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => setState(() {
                    _useBackupCode = false;
                    _errorMessage = null;
                  }),
                  child: const Text('Use authenticator app instead'),
                ),
              ],
              if (_errorMessage != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.error_outline, color: Colors.red[700]),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: TextStyle(color: Colors.red[700]),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
