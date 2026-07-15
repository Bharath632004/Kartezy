// lib/features/support/domain/usecase/send_feedback.dart
import '../repository/support_repository.dart';

class SendFeedback {
  final SupportRepository repository;

  SendFeedback(this.repository);

  Future<void> call(FeedbackParams params) {
    return repository.submitFeedback(
      feedback: params.feedback,
      rating: params.rating,
      contactInfo: params.contactInfo,
    );
  }
}

class FeedbackParams {
  final String feedback;
  final int rating;
  final String? contactInfo;

  const FeedbackParams({
    required this.feedback,
    required this.rating,
    this.contactInfo,
  });
}
