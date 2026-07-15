import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class WishlistPage extends ConsumerWidget {
  const WishlistPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Wishlist'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.pink.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.favorite_outline,
                    size: 48, color: Colors.pink[300]),
              ),
              const SizedBox(height: 24),
              Text(
                'Your wishlist is empty',
                style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Save your favorite products for later',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => context.go('/search'),
                icon: const Icon(Icons.explore_outlined),
                label: const Text('Discover Products'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
