import 'package:freezed_annotation/freezed_annotation.dart';

part 'sos_alert.freezed.dart';
part 'sos_alert.g.dart';

enum SosType { emergency, unsafeLocation, vehicleBreakdown, accident, health }

enum SosStatus { active, acknowledged, resolved, cancelled }

@freezed
class SosAlert with _$SosAlert {
  const factory SosAlert({
    required String id,
    required String partnerId,
    required SosType type,
    required SosStatus status,
    required double latitude,
    required double longitude,
    String? message,
    String? responderId,
    DateTime? acknowledgedAt,
    DateTime? resolvedAt,
    required DateTime createdAt,
  }) = _SosAlert;

  factory SosAlert.fromJson(Map<String, dynamic> json) =>
      _$SosAlertFromJson(json);
}
