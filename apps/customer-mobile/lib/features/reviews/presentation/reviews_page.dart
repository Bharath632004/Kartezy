// lib/features/reviews/presentation/reviews_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/reviews/presentation/widgets/review_list.dart';
import 'package:customer_mobile/features/reviews/presentation/widgets/write_review_button.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/get_reviews_usecase.dart';
import 'package:customer_mobile/shared/models/review.dart';

class ReviewsPage extends ConsumerStatefulWidget {
  final String productId;

  const ReviewsPage({super.key, required this.productId});

  @override
  ConsumerState<ReviewsPage> createState() => _ReviewsPageState();
}

class _ReviewsPageState extends ConsumerState<ReviewsPage> {
  @override
  void initState() {
    super.initState();
    // Load reviews when the page loads (fire and forget)
    final useCase = ref.read(getReviewsUseCaseProvider);
    useCase.call(widget.productId).catchError((e) {
      // Ignore errors in initState
      return <Review>[];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reviews'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Navigate to write review screen
            },
          ),
        ],
      ),
      body: Column(
        children: [
          const WriteReviewButton(),
          Expanded(
            child: Consumer(
              builder: (context, ref, _) {
                final reviewsAsync = ref.watch(
                  getReviewsProvider(widget.productId),
                );

                return reviewsAsync.when(
                  data: (reviews) => ReviewList(reviews: reviews),
                  loading: () =>
                      const Center(child: CircularProgressIndicator()),
                  error: (error, stackTrace) =>
                      Center(child: Text('Error loading reviews: $error')),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
