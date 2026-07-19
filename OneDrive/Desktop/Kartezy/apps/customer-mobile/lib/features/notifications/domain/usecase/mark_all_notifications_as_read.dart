// lib/features/notifications/domain/usecase/mark_all_notifications_as_read.dart
import '../repository/notification_repository.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/core/usecases/no_params.dart';

class MarkAllNotificationsAsRead extends UseCase<void, NoParams> {
  final NotificationRepository repository;

  MarkAllNotificationsAsRead(this.repository);

  @override
  Future<void> call(NoParams params) async {
    return repository.markAllAsRead();
  }
}
