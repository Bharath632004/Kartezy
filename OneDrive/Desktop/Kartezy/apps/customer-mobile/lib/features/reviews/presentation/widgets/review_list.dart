// lib/features/reviews/presentation/widgets/review_list.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/review.dart';

class ReviewList extends StatelessWidget {
  final List<Review> reviews;

  const ReviewList({super.key, required this.reviews});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: reviews.length,
      itemBuilder: (context, index) {
        final review = reviews[index];
        return ListTile(
          title: Text(review.title),
          subtitle: Text(review.comment),
        );
      },
    );
  }
}
