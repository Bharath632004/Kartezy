// lib/features/support/domain/usecase/send_feedback.dart
import '../repository/support_repository.dart';
import '../../core/usecases/usecase.dart';

class SendFeedback extends UseCase<void, FeedbackParams> {
  final SupportRepository repository;

  SendFeedback(this.repository);

  @override
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
