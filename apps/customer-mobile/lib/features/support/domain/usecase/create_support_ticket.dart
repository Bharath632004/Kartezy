// lib/features/support/domain/usecase/create_support_ticket.dart
import '../repository/support_repository.dart';
import '../entities/support_ticket.dart';

class CreateSupportTicket {
  final SupportRepository repository;

  CreateSupportTicket(this.repository);

  Future<SupportTicket> call(CreateSupportTicketParams params) async {
    return await repository.createSupportTicket(
      title: params.title,
      description: params.description,
      category: params.category,
      attachments: params.attachments,
    );
  }
}

class CreateSupportTicketParams {
  final String title;
  final String description;
  final String category;
  final List<String>? attachments;

  const CreateSupportTicketParams({
    required this.title,
    required this.description,
    required this.category,
    this.attachments,
  });
}
