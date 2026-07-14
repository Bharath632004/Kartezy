// lib/features/support/domain/entities/support_ticket.dart
class SupportTicket {
  final String id;
  final String title;
  final String description;
  final String status; // 'open', 'in_progress', 'resolved', 'closed'
  final String priority; // 'low', 'medium', 'high', 'urgent'
  final String category; // 'technical', 'billing', 'account', etc.
  final DateTime createdAt;
  final DateTime? updatedAt;
  final List<String> attachments; // URLs to attachment files
  final String? assignedTo; // Admin ID if assigned
  final String userId; // User who created the ticket

  SupportTicket({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    required this.category,
    required this.createdAt,
    this.updatedAt,
    this.attachments = const [],
    this.assignedTo,
    required this.userId,
  });

  factory SupportTicket.fromJson(Map<String, dynamic> json) {
    return SupportTicket(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      status: json['status'] as String,
      priority: json['priority'] as String,
      category: json['category'] as String,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      attachments: List<String>.from(json['attachments'] ?? []),
      assignedTo: json['assignedTo'] as String?,
      userId: json['userId'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      'category': category,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'attachments': attachments,
      'assignedTo': assignedTo,
      'userId': userId,
    };
  }
}
