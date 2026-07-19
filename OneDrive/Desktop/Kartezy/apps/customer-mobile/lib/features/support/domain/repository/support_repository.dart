// lib/features/support/domain/repository/support_repository.dart
import '../entities/support_ticket.dart';

abstract class SupportRepository {
  Future<List<SupportTicket>> getSupportTickets({
    int limit = 20,
    int offset = 0,
    String? status,
  });

  Future<SupportTicket> getSupportTicketById(String ticketId);

  Future<SupportTicket> createSupportTicket({
    required String title,
    required String description,
    required String category,
    List<String>? attachments,
  });

  Future<SupportTicket> updateSupportTicket({
    required String ticketId,
    String? title,
    String? description,
    String? status,
    String? priority,
    String? category,
    List<String>? attachments,
  });

  Future<void> deleteSupportTicket(String ticketId);

  Future<void> submitFeedback({
    required String feedback,
    required int rating,
    String? contactInfo,
  });
}
