// lib/features/home/home_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kartezy Home')),
      body: const Center(
        child: Text('Welcome to Kartezy!', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
