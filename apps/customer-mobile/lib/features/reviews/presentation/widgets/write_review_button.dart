// lib/features/reviews/presentation/widgets/write_review_button.dart
import 'package:flutter/material.dart';

class WriteReviewButton extends StatelessWidget {
  const WriteReviewButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        // Navigate to write review screen
      },
      child: const Text('Write Review'),
    );
  }
}
