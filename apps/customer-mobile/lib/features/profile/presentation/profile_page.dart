// lib/features/profile/presentation/profile_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/profile/domain/usecase/get_profile_usecase.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:customer_mobile/shared/widgets/button.dart';
import 'package:customer_mobile/core/services/auth_service.dart';

class ProfilePage extends ConsumerStatefulWidget {
  const ProfilePage({super.key});

  @override
  ConsumerState<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<ProfilePage> {
  late final Future<User> _profileFuture;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final profileUseCase = ref.read(getProfileUseCaseProvider);
      final user = await profileUseCase.call();
      // We don't need to store the user anywhere specific for now.
      // In a real app, you might update a provider or state.
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load profile: $e';
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            )
          : FutureBuilder<User>(
              future: ref.read(getProfileUseCaseProvider).call(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                if (!snapshot.hasData) {
                  return const Center(child: Text('No profile data'));
                }
                final user = snapshot.data!;
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundImage: user.avatarUrl != null
                            ? NetworkImage(user.avatarUrl!)
                            : null,
                        child: user.avatarUrl == null
                            ? Text(
                                user.name.isNotEmpty
                                    ? user.name[0].toUpperCase()
                                    : '?',
                                style: const TextStyle(fontSize: 24),
                              )
                            : null,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Name:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        user.name,
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Email:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        user.email,
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      const SizedBox(height: 8),
                      if (user.phone != null)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Phone:',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            Text(
                              user.phone!,
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                          ],
                        ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _logout,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                          ),
                          child: const Text('Logout'),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }

  Future<void> _logout() async {
    setState(() {
      _isLoading = true;
    });
    try {
      //  Implement logout using auth service
      // For now, we'll just clear the tokens and go to login.
      final authService = ref.read(authServiceProvider);
      await authService.logout();
      if (mounted) {
        // Go to login screen
        context.go('/login');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Logout failed: $e';
          _isLoading = false;
        });
      }
    }
  }
}
