// lib/features/authentication/presentation/otp_verification_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/authentication/domain/usecase/verify_otp_usecase.dart';
import 'package:customer_mobile/shared/widgets/button.dart';

class OtpVerificationPage extends ConsumerStatefulWidget {
  final String phoneNumber;

  const OtpVerificationPage({
    super.key,
    required this.phoneNumber,
  });

  @override
  ConsumerState<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends ConsumerState<OtpVerificationPage> {
  final List<TextEditingController> _otpControllers =
      List.generate(6, (_) => TextEditingController());
  bool _isVerifying = false;
  String? _errorMessage;
  bool _canResend = false;
  int _resendTimer = 30;

  @override
  void initState() {
    super.initState();
    // Start resend timer
    _startResendTimer();
  }

  @override
  void dispose() {
    for (var controller in _otpControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _startResendTimer() {
    _canResend = false;
    _resendTimer = 30;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        setState(() {
          _resendTimer--;
        });
      }
      return _resendTimer > 0;
    }).then((_) {
      if (mounted) {
        setState(() {
          _canResend = true;
        });
      }
    });
  }

  String _getOtp() {
    return _otpControllers.map((c) => c.text).join();
  }

  void _clearOtp() {
    for (var controller in _otpControllers) {
      controller.clear();
    }
    if (mounted) {
      _otpControllers.first.focus();
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _getOtp();
    if (otp.length != 6) {
      setState(() {
        _errorMessage = 'Please enter a 6-digit OTP';
      });
      return;
    }

    setState(() {
      _isVerifying = true;
      _errorMessage = null;
    });
    try {
      final verifyOtpUseCase = ref.read(verifyOtpUseCaseProvider);
      final user = await verifyOtpUseCase.call(phoneNumber, otp);
      if (mounted) {
        // OTP verification successful, navigate to home
        context.go('/home');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Invalid OTP: $e';
          _clearOtp();
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isVerifying = false);
      }
    }
  }

  void _resendOtp() {
    // In a real app, we would call the sendOtp use case again.
    // For simplicity, we just restart the timer.
    setState(() {
      _errorMessage = null;
    });
    _startResendTimer();
    // TODO: Actually resend OTP via API
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Verify OTP'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'We have sent an OTP to $phoneNumber',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            // OTP input fields
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(6, (index) {
                return SizedBox(
                  width: 40,
                  child: TextField(
                    controller: _otpControllers[index],
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    maxLength: 1,
                    decoration: const InputDecoration(
                      counterText: '',
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (value) {
                      if (value.length == 1 && index < 5) {
                        // Move to next field
                        FocusScope.of(context).nextFocus();
                      } else if (value.isEmpty && index > 0) {
                        // Move to previous field
                        FocusScope.of(context).previousFocus();
                      }
                    },
                  ),
                );
              }),
            ),
            const SizedBox(height: 24),
            if (_errorMessage != null)
              Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 16),
            _isVerifying
                ? const CircularProgressIndicator()
                : AppButton(
                    text: 'Verify OTP',
                    onPressed: _verifyOtp,
                  ),
            const SizedBox(height: 16),
            if (!_canResend)
              Text(
                'Resend OTP in $_resendTimer seconds',
                style: TextStyle(color: Colors.grey[600]),
              )
            else
              TextButton(
                onPressed: _resendOtp,
                child: const Text('Resend OTP'),
              ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                // Go back to phone login
                context.pop();
              },
              child: const Text('Change Phone Number'),
            ),
          ],
        ),
      ),
    );
  }
}