import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:merchant_mobile/core/services/auth_service.dart';
import 'package:merchant_mobile/core/storage/hive_manager.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  final PageController _controller = PageController();
  bool _isLastPage = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _isLastPage = (index == 2);
    });
  }

  void _skip() {
    _markAsSeen();
    _goToNext();
  }

  void _next() {
    if (_isLastPage) {
      _markAsSeen();
      _goToNext();
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeIn,
      );
    }
  }

  void _markAsSeen() async {
    await ref.read(hiveManagerProvider).setHasSeenOnboarding(true);
  }

  void _goToNext() {
    if (!mounted) return;
    ref.read(authServiceProvider).isLoggedIn().then((value) {
      if (mounted) {
        if (value) {
          GoRouter.of(context).go('/dashboard');
        } else {
          GoRouter.of(context).go('/login');
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Align(
                alignment: Alignment.topRight,
                child: TextButton(onPressed: _skip, child: const Text('Skip')),
              ),
              Expanded(
                child: PageView(
                  controller: _controller,
                  onPageChanged: _onPageChanged,
                  children: const [
                    OnboardingPageItem(
                      title: 'Welcome to Kartzezy Merchant',
                      description:
                          'Manage your store, track sales, and grow your business with our all-in-one merchant app.',
                      image: 'assets/images/onboarding1.png',
                    ),
                    OnboardingPageItem(
                      title: 'Real-time Analytics',
                      description:
                          'Get instant insights into your sales, customers, and performance with beautiful charts and reports.',
                      image: 'assets/images/onboarding2.png',
                    ),
                    OnboardingPageItem(
                      title: 'Ready to Start?',
                      description:
                          'Let\'s set up your store and start taking orders today.',
                      image: 'assets/images/onboarding3.png',
                    ),
                  ],
                ),
              ),
              // Indicator
              Center(
                child: SmoothPageIndicator(
                  controller: _controller,
                  count: 3,
                  effect: const ExpandingDotsEffect(
                    activeDotColor: Colors.deepPurple,
                    dotHeight: 8,
                    dotWidth: 8,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: ElevatedButton(
                  onPressed: _next,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(50),
                    backgroundColor: Colors.deepPurple,
                  ),
                  child: Text(
                    _isLastPage ? 'Get Started' : 'Next',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}

class OnboardingPageItem extends StatelessWidget {
  final String title;
  final String description;
  final String image;

  const OnboardingPageItem({
    super.key,
    required this.title,
    required this.description,
    required this.image,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(image, height: 250, fit: BoxFit.contain),
        const SizedBox(height: 30),
        Text(
          title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),
        Text(
          description,
          style: const TextStyle(fontSize: 16, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
