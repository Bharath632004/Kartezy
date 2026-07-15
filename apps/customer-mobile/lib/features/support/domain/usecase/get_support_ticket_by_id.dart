// lib/features/support/domain/usecase/get_support_ticket_by_id.dart
import '../repository/support_repository.dart';
import '../entities/support_ticket.dart';

class GetSupportTicketById {
  final SupportRepository repository;

  GetSupportTicketById(this.repository);

  Future<SupportTicket> call(String ticketId) {
    return repository.getSupportTicketById(ticketId);
  }
}
