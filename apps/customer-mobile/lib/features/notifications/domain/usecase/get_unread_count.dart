// lib/features/notifications/domain/usecase/get_unread_count.dart
import '../repository/notification_repository.dart';
import '../../core/usecases/usecase.dart';

class GetUnreadCount extends UseCase<int, NoParams> {
  final NotificationRepository repository;

  GetUnreadCount(this.repository);

  @override
  Future<int> call() {
    return repository.getUnreadCount();
  }
}