// lib/features/notifications/domain/usecase/delete_notification.dart
import '../repository/notification_repository.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';

class DeleteNotification extends UseCase<void, String> {
  final NotificationRepository repository;

  DeleteNotification(this.repository);

  @override
  Future<void> call(String notificationId) {
    return repository.deleteNotification(notificationId);
  }
}
