// lib/shared/models/order_timeline.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_timeline.freezed.dart';
part 'order_timeline.g.dart';

@freezed
class OrderTimeline with _$OrderTimeline {
  const factory OrderTimeline({
    required String id,
    required String orderId,
    required String status,
    required String description,
    required DateTime timestamp,
    String? updatedBy,
  }) = _OrderTimeline;

  factory OrderTimeline.fromJson(Map<String, dynamic> json) =>
      _$OrderTimelineFromJson(json);
}
