import 'package:freezed_annotation/freezed_annotation.dart';

part 'driver_profile.freezed.dart';
part 'driver_profile.g.dart';

/// Driver verification status.
enum VerificationStatus { pending, submitted, underReview, approved, rejected }

/// Vehicle type enum.
enum VehicleType { bicycle, motorcycle, scooter, car, van, truck }

/// Represents a delivery partner's profile.
@freezed
class DriverProfile with _$DriverProfile {
  const factory DriverProfile({
    required String id,
    required String userId,
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    String? photoUrl,
    String? vehicleNumber,
    VehicleType? vehicleType,
    String? vehicleBrand,
    String? vehicleModel,
    int? vehicleYear,
    String? licenseNumber,
    String? aadhaarNumber,
    String? panNumber,
    String? bankAccountNumber,
    String? bankIfsc,
    String? bankName,
    required double rating,
    required int totalRatings,
    required int totalDeliveries,
    required int completedDeliveries,
    required int cancelledDeliveries,
    double? acceptanceRate,
    double? completionRate,
    double? onTimeRate,
    double? averageDeliveryTimeMinutes,
    required VerificationStatus kycStatus,
    VerificationStatus? drivingLicenseStatus,
    VerificationStatus? vehicleRegistrationStatus,
    VerificationStatus? insuranceStatus,
    required bool isOnline,
    required bool isOnBreak,
    String? currentShiftId,
    required DateTime joinedAt,
    DateTime? lastActiveAt,
    String? preferredLanguage,
    List<String>? languages,
    String? emergencyContactName,
    String? emergencyContactPhone,
    List<String>? badges,
    int? performanceScore,
  }) = _DriverProfile;

  factory DriverProfile.fromJson(Map<String, dynamic> json) =>
      _$DriverProfileFromJson(json);

  /// Full name getter.
  String get fullName => '$firstName $lastName';
}
