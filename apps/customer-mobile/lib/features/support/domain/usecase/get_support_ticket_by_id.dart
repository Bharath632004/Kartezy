// lib/features/support/domain/usecase/get_support_ticket_by_id.dart
import '../repository/support_repository.dart';
import '../../core/usecases/usecase.dart';

class GetSupportTicketById extends UseCase<SupportTicket, String> {
  final SupportRepository repository;

  GetSupportTicketById(this.repository);

  @override
  Future<SupportTicket> call(String ticketId) {
    return repository.getSupportTicketById(ticketId);
  }
}