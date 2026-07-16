import 'package:freezed_annotation/freezed_annotation.dart';

part 'address.freezed.dart';
part 'address.g.dart';

@freezed
class Address with _$Address {
  const factory Address({
    required String id,
    required String? userId,
    @JsonKey(name: 'recipientName') required String name,
    @JsonKey(name: 'phoneNumber') required String phone,
    required String addressLine1,
    required String addressLine2,
    required String city,
    required String state,
    required String postalCode,
    required String country,
    required bool isDefault,
    required double? latitude,
    required double? longitude,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Address;

  factory Address.fromJson(Map<String, dynamic> json) =>
      _$AddressFromJson(json);
}
