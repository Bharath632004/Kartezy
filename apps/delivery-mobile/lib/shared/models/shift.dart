import 'package:freezed_annotation/freezed_annotation.dart';

part 'shift.freezed.dart';
part 'shift.g.dart';

/// Represents a delivery partner's work shift.
@freezed
class Shift with _$Shift {
  const factory Shift({
    required String id,
    required String partnerId,
    required DateTime startTime,
    DateTime? endTime,
    required bool isActive,
    required bool isOnBreak,
    DateTime? breakStartTime,
    Duration? totalBreakDuration,
    required int ordersDelivered,
    required double totalEarnings,
    required double totalDistanceKm,
    required double averageDeliveryTimeMinutes,
  }) = _Shift;

  factory Shift.fromJson(Map<String, dynamic> json) => _$ShiftFromJson(json);

  /// Calculate total shift duration.
  Duration get totalDuration {
    final end = endTime ?? DateTime.now();
    return end.difference(startTime);
  }

  /// Calculate effective working time (excluding breaks).
  Duration get effectiveWorkingTime {
    return totalDuration - (totalBreakDuration ?? Duration.zero);
  }
}
