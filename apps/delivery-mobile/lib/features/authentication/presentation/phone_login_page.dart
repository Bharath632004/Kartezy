// lib/features/authentication/presentation/phone_login_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:country_code_picker/country_code_picker.dart';
import 'package:delivery_mobile/features/authentication/domain/usecase/send_otp_usecase.dart';
import 'package:delivery_mobile/shared/widgets/button.dart';

class PhoneLoginPage extends ConsumerStatefulWidget {
  const PhoneLoginPage({super.key});

  @override
  ConsumerState<PhoneLoginPage> createState() => _PhoneLoginPageState();
}

class _PhoneLoginPageState extends ConsumerState<PhoneLoginPage> {
  final _phoneController = TextEditingController();
  String _selectedCountryCode = 'US'; // Default to US
  bool _isSending = false;
  String? _errorMessage;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    setState(() {
      _isSending = true;
      _errorMessage = null;
    });
    final phoneNumber = '+$_selectedCountryCode${_phoneController.text}';
    try {
      final sendOtpUseCase = ref.read(sendOtpUseCaseProvider);
      await sendOtpUseCase.call(phoneNumber);
      // OTP sent successfully, navigate to verification screen
      if (mounted) {
        context.go('/otp-verification', extra: {'phoneNumber': phoneNumber});
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to send OTP: $e';
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isSending = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login with Phone')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Enter your phone number to receive an OTP',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            // Country picker and phone number input
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: CountryCodePicker(
                    onChanged: (CountryCode countryCode) {
                      setState(() {
                        _selectedCountryCode = countryCode.code ?? 'US';
                      });
                    },
                    initialSelection: 'US',
                    favorite: const ['+1', 'us'],
                    // Hide the country name, only show code and flag
                    showCountryOnly: false,
                    showOnlyCountryWhenClosed: false,
                    alignLeft: false,
                  ),
                ),
                Expanded(
                  flex: 3,
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_errorMessage != null)
              Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            _isSending
                ? const CircularProgressIndicator()
                : AppButton(text: 'Send OTP', onPressed: _sendOtp),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                // Go back to login
                context.go('/login');
              },
              child: const Text('Back to Login'),
            ),
          ],
        ),
      ),
    );
  }
}
