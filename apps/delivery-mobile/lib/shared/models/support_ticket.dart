import 'package:freezed_annotation/freezed_annotation.dart';

part 'support_ticket.freezed.dart';
part 'support_ticket.g.dart';

enum TicketStatus { open, inProgress, resolved, closed }

enum TicketCategory {
  orderIssue,
  paymentIssue,
  vehicleBreakdown,
  accident,
  customerIssue,
  merchantIssue,
  appIssue,
  other,
}

@freezed
class SupportTicket with _$SupportTicket {
  const factory SupportTicket({
    required String id,
    required String partnerId,
    required String subject,
    required String description,
    required TicketCategory category,
    required TicketStatus status,
    String? orderId,
    List<String>? attachmentUrls,
    String? assignedTo,
    String? resolution,
    required DateTime createdAt,
    DateTime? updatedAt,
    DateTime? resolvedAt,
  }) = _SupportTicket;

  factory SupportTicket.fromJson(Map<String, dynamic> json) =>
      _$SupportTicketFromJson(json);
}
