import 'package:freezed_annotation/freezed_annotation.dart';

part 'faq.freezed.dart';
part 'faq.g.dart';

@freezed
class FaqItem with _$FaqItem {
  const factory FaqItem({
    required String id,
    required String question,
    required String answer,
    required String category,
    int? sortOrder,
  }) = _FaqItem;

  factory FaqItem.fromJson(Map<String, dynamic> json) =>
      _$FaqItemFromJson(json);
}

@freezed
class TrustedContact with _$TrustedContact {
  const factory TrustedContact({
    required String id,
    required String partnerId,
    required String name,
    required String phone,
    String? relationship,
    required bool isActive,
    required DateTime createdAt,
  }) = _TrustedContact;

  factory TrustedContact.fromJson(Map<String, dynamic> json) =>
      _$TrustedContactFromJson(json);
}

@freezed
class IncidentReport with _$IncidentReport {
  const factory IncidentReport({
    required String id,
    required String partnerId,
    required String type,
    required String description,
    required double latitude,
    required double longitude,
    String? orderId,
    List<String>? imageUrls,
    required String status,
    required DateTime createdAt,
  }) = _IncidentReport;

  factory IncidentReport.fromJson(Map<String, dynamic> json) =>
      _$IncidentReportFromJson(json);
}
