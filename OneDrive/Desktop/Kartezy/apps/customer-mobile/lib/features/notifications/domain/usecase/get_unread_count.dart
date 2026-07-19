// lib/features/notifications/domain/usecase/get_unread_count.dart
import '../repository/notification_repository.dart';
import 'package:customer_mobile/core/usecases/usecase.dart';
import 'package:customer_mobile/core/usecases/no_params.dart';

class GetUnreadCount extends UseCase<int, NoParams> {
  final NotificationRepository repository;

  GetUnreadCount(this.repository);

  @override
  Future<int> call(NoParams params) {
    return repository.getUnreadCount();
  }
}
