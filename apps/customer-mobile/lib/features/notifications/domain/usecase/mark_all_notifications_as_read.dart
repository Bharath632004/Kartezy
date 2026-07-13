// lib/features/notifications/domain/usecase/mark_all_notifications_as_read.dart
import '../repository/notification_repository.dart';
import '../../core/usecases/usecase.dart';

class MarkAllNotificationsAsRead extends UseCase<void, NoParams> {
  final NotificationRepository repository;

  MarkAllNotificationsAsRead(this.repository);

  @override
  Future<void> call() {
    return repository.markAllAsRead();
  }
}