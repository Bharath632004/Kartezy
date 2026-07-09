// lib/features/onboarding/onboarding_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';
import 'package:customer_mobile/core/storage/hive_manager.dart';
import 'package:customer_mobile/navigation/router.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  bool _isLoading = false;

  // Onboarding pages data
  static const List<Map<String, String>> _pages = [
    {
      'title': 'Welcome to Kartezy',
      'description':
          'Get groceries and essentials delivered to your doorstep in minutes.',
      'image': 'assets/onboarding/welcome.png',
    },
    {
      'title': 'Fast & Reliable Delivery',
      'description':
          'Our network of local stores ensures you get what you need, when you need it.',
      'image': 'assets/onboarding/fast_delivery.png',
    },
    {
      'title': 'Wide Selection',
      'description': 'Choose from thousands of products across categories.',
      'image': 'assets/onboarding/selection.png',
    },
    {
      'title': 'Exclusive Member Benefits',
      'description':
          'Join our loyalty program for discounts, free delivery, and early access to sales.',
      'image': 'assets/onboarding/member_benefits.png',
    },
  ];

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _completeOnboarding() async {
    setState(() => _isLoading = true);
    try {
      final hiveManager = ref.read(hiveManagerProvider);
      final settingsBox = hiveManager.getBox<bool>(boxName: 'settings');
      await settingsBox.put('onboardingCompleted', true);
      if (mounted) {
        // Navigate to login or home based on auth status
        // For simplicity, we'll go to login; the splash screen will handle redirection
        // But we are already in onboarding, so we can go to login directly.
        // However, we should let the splash decide after onboarding.
        // We'll just go to splash again, which will redirect appropriately.
        // But to avoid infinite loop, we can go to login.
        // We'll use the router from ref.
        final goRouter = ref.read(goRouterProvider);
        goRouter.go('/login');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save preferences: $e')),
        );
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
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: _pages.length,
            onPageChanged: (index) {
              setState(() => _currentPage = index);
            },
            itemBuilder: (context, index) {
              final page = _pages[index];
              return Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      page['image']!,
                      height: 250,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      page['title']!,
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      page['description']!,
                      style: Theme.of(context).textTheme.bodyLarge,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == index ? 12 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(
                            context,
                          ).colorScheme.primary.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 24,
            left: 24,
            right: 24,
            child: ElevatedButton(
              onPressed: _isLoading
                  ? null
                  : _currentPage == _pages.length - 1
                  ? _completeOnboarding
                  : () {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                _currentPage == _pages.length - 1 ? 'Get Started' : 'Next',
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
          if (_currentPage > 0)
            Positioned(
              bottom: 24,
              left: 24,
              child: TextButton(
                onPressed: _isLoading
                    ? null
                    : () {
                        _pageController.previousPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                child: const Text('Back'),
              ),
            ),
        ],
      ),
    );
  }
}
