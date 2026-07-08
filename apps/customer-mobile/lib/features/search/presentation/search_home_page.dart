// lib/features/search/presentation/search_home_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/widgets/search_bar.dart';
import 'package:customer_mobile/features/search/presentation/widgets/recent_searches.dart';
import 'package:customer_mobile/features/search/presentation/widgets/trending_searches.dart';
import 'package:customer_mobile/features/search/presentation/widgets/popular_categories.dart';
import 'package:customer_mobile/features/search/presentation/widgets/popular_brands.dart';
import 'package:customer_mobile/features/search/presentation/widgets/recommended_searches.dart';
import 'package:customer_mobile/features/search/presentation/widgets/seasonal_searches.dart';
import 'package:customer_mobile/features/search/presentation/widgets/voice_search_button.dart';
import 'package:customer_mobile/features/search/presentation/widgets/barcode_scanner_button.dart';
import 'package:customer_mobile/features/search/presentation/widgets/image_search_button.dart';

class SearchHomePage extends ConsumerStatefulWidget {
  const SearchHomePage({super.key});

  @override
  ConsumerState<SearchHomePage> createState() => _SearchHomePageState();
}

class _SearchHomePageState extends ConsumerState<SearchHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              // TODO: Navigate to profile
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SearchBarWidget(),
              const SizedBox(height: 24),
              const RecentSearchesWidget(),
              const SizedBox(height: 24),
              const TrendingSearchesWidget(),
              const SizedBox(height: 24),
              const PopularCategoriesWidget(),
              const SizedBox(height: 24),
              const PopularBrandsWidget(),
              const SizedBox(height: 24),
              const RecommendedSearchesWidget(),
              const SizedBox(height: 24),
              const SeasonalSearchesWidget(),
              const SizedBox(height: 24),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children [
                  VoiceSearchButton(),
                  BarcodeScannerButton(),
                  ImageSearchButton(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}