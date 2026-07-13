// lib/features/notifications/domain/usecase/get_notifications.dart
import '../repository/notification_repository.dart';
import '../../core/usecases/usecase.dart';

class GetNotifications extends UseCase<List<Notification>, Params> {
  final NotificationRepository repository;

  GetNotifications(this.repository);

  @override
Future<List<Notification>> call(Params params) async {
    return await repository.getNotifications(
      limit: params.limit,
      offset: params.offset,
    );
  }
}

class Params {
  final int limit;
  final int offset;

  const Params({
    this.limit = 20,
    this.offset = 0,
  });
}