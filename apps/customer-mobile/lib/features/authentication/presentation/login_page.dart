// lib/features/authentication/presentation/login_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/authentication/domain/usecase/login_usecase.dart';
import 'package:customer_mobile/shared/widgets/button.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      final response = await ref
          .read(loginUseCaseProvider)
          .call(email, password);

      if (mounted) {
        if (response.mfaRequired) {
          // MFA required - navigate to MFA verification page
          context.go(
            '/mfa-verify',
            extra: {
              'email': response.email ?? email,
              'mfaSessionToken': response.mfaSessionToken ?? '',
            },
          );
        } else {
          // Login successful, navigate to home
          context.go('/home');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Something went wrong: $e';
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            if (_errorMessage != null)
              Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            _isLoading
                ? const CircularProgressIndicator()
                : AppButton(text: 'Login', onPressed: _login),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                context.push('/phone-login?purpose=reset');
              },
              child: const Text('Forgot Password?'),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                // Navigate to phone login
                context.go('/phone-login');
              },
              child: const Text('Login with Phone'),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                context.push('/phone-login?purpose=register');
              },
              child: const Text('Create Account'),
            ),
          ],
        ),
      ),
    );
  }
}
