// lib/shared/models/driver_info.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'driver_info.freezed.dart';
part 'driver_info.g.dart';

@freezed
class DriverInfo with _$DriverInfo {
  const factory DriverInfo({
    required String id,
    required String name,
    String? photoUrl,
    required String vehicleNumber,
    required String vehicleType,
    required double rating,
    required String phoneNumber,
  }) = _DriverInfo;

  factory DriverInfo.fromJson(Map<String, dynamic> json) =>
      _$DriverInfoFromJson(json);
}
