// lib/features/support/domain/usecase/get_support_tickets.dart
import '../repository/support_repository.dart';
import '../../core/usecases/usecase.dart';

class GetSupportTickets extends UseCase {
  final SupportRepository repository;

  GetSupportTickets(this.repository);

  Future<List<SupportTicket>> call({
    int limit = 20,
    int offset = 0,
    String? status,
  }) async {
    return await repository.getSupportTickets(
      limit: limit,
      offset: offset,
      status: status,
    );
  }
}