// lib/features/notifications/domain/usecase/mark_notification_as_read.dart
import '../repository/notification_repository.dart';
import '../../core/usecases/usecase.dart';

class MarkNotificationAsRead extends UseCase<void, String> {
  final NotificationRepository repository;

  MarkNotificationAsRead(this.repository);

  @override
  Future<void> call(String notificationId) {
    return repository.markAsRead(notificationId);
  }
}