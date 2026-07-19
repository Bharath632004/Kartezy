// lib/features/support/data/datasource/support_remote_data_source.dart
import 'package:customer_mobile/core/network/api_constants.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import '../../domain/entities/support_ticket.dart';

abstract class SupportRemoteDataSource {
  Future<List<SupportTicket>> getSupportTickets({
    int limit = 20,
    int offset = 0,
    String? status,
  });

  Future<SupportTicket> getSupportTicketById(String ticketId);

  Future<SupportTicket> createSupportTicket({
    required String subject,
    required String description,
    required String category,
    required String priority,
    List<String>? attachments,
  });

  Future<void> updateSupportTicket(
    String ticketId,
    Map<String, dynamic> updates,
  );

  Future<void> closeSupportTicket(String ticketId);

  Future<void> submitFeedback(String feedback, int rating, String? contactInfo);
}

class SupportRemoteDataSourceImpl implements SupportRemoteDataSource {
  final DioClient dioClient;

  SupportRemoteDataSourceImpl(this.dioClient);

  @override
  Future<List<SupportTicket>> getSupportTickets({
    int limit = 20,
    int offset = 0,
    String? status,
  }) async {
    final response = await dioClient.get(
      ApiConstants.supportTickets,
      queryParameters: {
        'limit': limit,
        'offset': offset,
        'status': status,
      },
    );

    final List<dynamic> data = response.data['tickets'] as List<dynamic>;
    return data.map((json) => SupportTicket.fromJson(json)).toList();
  }

  @override
  Future<SupportTicket> getSupportTicketById(String ticketId) async {
    final response = await dioClient.get(
      '${ApiConstants.supportTickets}/$ticketId',
    );
    return SupportTicket.fromJson(response.data);
  }

  @override
  Future<SupportTicket> createSupportTicket({
    required String subject,
    required String description,
    required String category,
    required String priority,
    List<String>? attachments,
  }) async {
    final response = await dioClient.post(
      ApiConstants.supportTickets,
      data: {
        'subject': subject,
        'description': description,
        'category': category,
        'priority': priority,
        'attachments': attachments,
      },
    );
    return SupportTicket.fromJson(response.data);
  }

  @override
  Future<void> updateSupportTicket(
    String ticketId,
    Map<String, dynamic> updates,
  ) async {
    await dioClient.put(
      '${ApiConstants.supportTickets}/$ticketId',
      data: updates,
    );
  }

  @override
  Future<void> closeSupportTicket(String ticketId) async {
    await dioClient.post(
      '${ApiConstants.supportTickets}/$ticketId/close',
    );
  }

  @override
  Future<void> submitFeedback(
    String feedback,
    int rating,
    String? contactInfo,
  ) async {
    await dioClient.post(
      ApiConstants.feedback,
      data: {
        'feedback': feedback,
        'rating': rating,
        'contact_info': contactInfo,
      },
    );
  }
}
